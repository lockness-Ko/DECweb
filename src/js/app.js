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
    App.contracts.Node.deployed().then(function (instance) {
      instance.addSite($("#code_input").val(), {
        from: App.account
      }).then(() => {
        instance.siteCount().then((x) => {
          window.location.href = "http://" + window.location.host + "/?site=" + x;
        });
      });

    });
  },

  render: function () {
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
        web3.eth.getBalance(App.account,(a,b,c,d)=>{
          $("#accountBalance").html("Your Balance: "+ b.c[0]/10000+ "ETH");
        });
      } else {
        console.error(err)
      }
    });
    if (window.location.href.includes('addSite')) // THIS IS A MANUAL STOP 
    {} else {
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
          document.write(x[1]);
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