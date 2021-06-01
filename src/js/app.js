function lzw_encode(s) {
  var dict = {};
  var data = (s + "").split("");
  var out = [];
  var currChar;
  var phrase = data[0];
  var code = 256;
  for (var i = 1; i < data.length; i++) {
    currChar = data[i];
    if (dict[phrase + currChar] != null) {
      phrase += currChar;
    } else {
      out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
      dict[phrase + currChar] = code;
      code++;
      phrase = currChar;
    }
  }
  out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
  for (var i = 0; i < out.length; i++) {
    out[i] = String.fromCharCode(out[i]);
  }
  return out.join("");
}

// Decompress an LZW-encoded string
function lzw_decode(s) {
  var dict = {};
  var data = (s + "").split("");
  var currChar = data[0];
  var oldPhrase = currChar;
  var out = [currChar];
  var code = 256;
  var phrase;
  for (var i = 1; i < data.length; i++) {
    var currCode = data[i].charCodeAt(0);
    if (currCode < 256) {
      phrase = data[i];
    } else {
      phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
    }
    out.push(phrase);
    currChar = phrase.charAt(0);
    dict[code] = oldPhrase + currChar;
    code++;
    oldPhrase = phrase;
  }
  return out.join("");
}

App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = window.ethereum;
      web3 = new Web3(window.ethereum);
      window.ethereum.enable().catch(error => {
        console.log(error)
      })
    } else {
      alert("Please use MetaMask with an active node RPC!")
      // Specify default instance if no web3 instance provided
      // App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      // web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Node.json", function (node) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Node = TruffleContract(node);
      // Connect provider to interact with contract
      App.contracts.Node.setProvider(App.web3Provider);

      // App.listenForEvents();

      return App.render();
    });
  },

  addSite: function () {
    if (confirm("HAVE YOU SAVED THE KEY (" + $("#key").val() + ") FAILURE TO REMEMBER/SAVE THE CORRECT KEY WILL RESULT IN LOST ETHER")) {
      App.contracts.Node.deployed().then(function (instance) {
        instance.addSite($("#key").val(), lzw_encode($("#code_input").val()), {
          from: App.account
        }).then(() => {
          instance.siteCount().then((x) => {
            window.location.href = "http://" + window.location.host + "/?site=" + x;
          });
        });

      });
    } else {

    }
  },

  editSite: function () {
    if (confirm("ARE YOU SURE YOU HAVE THE CORRECT KEY (" + $("#key").val() + ") FAILURE TO USE THE CORRECT KEY WILL RESULT IN LOST ETHER")) {
      App.contracts.Node.deployed().then(function (instance) {
        instance.editSite($("#id").val(), $("#key").val(), lzw_encode($("#code_input").val()), {
          from: App.account
        }).then(() => {
          instance.siteCount().then((x) => {
            window.location.href = "http://" + window.location.host + "/?site=" + x;
          });
        });

      });
    } else {

    }
  },

  render: function () {
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
        web3.eth.getBalance(App.account, (a, b, c, d) => {
          $("#accountBalance").html("Your Balance: " + b.c[0] / 10000 + "ETH");
        });
      } else {
        console.error(err)
      }
    });
    if (window.location.href.includes('addSite') || window.location.href.includes('editsite')) // THIS IS A MANUAL STOP 
    {} else if (window.location.href.includes('dirSite')) {
      App.contracts.Node.deployed().then(function (instance) {
        NodeInstance = instance;
        return NodeInstance.siteCount();
      }).then(function (siteCount) {
        // alert(siteCount);
        for (let i = 0; i < siteCount; i++) {
          NodeInstance.sites(i).then((x) => {
            // alert(1)
            a = document.createElement("div");
            a.innerHTML = "<a href=\"http://"+window.location.host+"/?site="+(parseInt(x[0])+1)+"\">Site #"+(parseInt(x[0])+1)+"</a>";
            document.querySelector("#content").innerHTML = "";
            document.querySelector(".text-center").textContent = "Sites Directory";
            document.querySelector("#content").appendChild(a);
          });
        }
        
      }).catch(function (error) {
        console.error(error);
      });
    } else {
      // Load contract data
      App.contracts.Node.deployed().then(function (instance) {
        NodeInstance = instance;
        return NodeInstance.siteCount();
      }).then(function (siteCount) {
        // alert(siteCount);
        //     var id = site[0];
        //     var code = site[1];
        //     var key = site[2];
        NodeInstance.sites(parseInt(window.location.href.split("site=")[1])).then((x) => {
          document.write(dsml2html(lzw_decode(x[1])));
        });
      }).catch(function (error) {
        console.error(error);
      });
    }
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});