pragma solidity >=0.4.22;

contract Node {
    struct Site {
        uint id;
        string code;
        uint key;
    }

    mapping(uint => Site) public sites;
    uint public siteCount;

    constructor() public {
        // addSite("BRUH WHAT THE DOG DOIN");
        // addSite("lol?");
    }

    function addSite(uint key, string memory _name) public {
        siteCount++;
        sites[siteCount] = Site(siteCount, _name, key);
    }

    function editSite(uint id, uint key, string memory _name) public {
        if(sites[id].key != key) {
            //YOU BROKE THE RULES
        }
        else {
            sites[id] = Site(id, _name, key);
        }
    }
}