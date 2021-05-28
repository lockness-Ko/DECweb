pragma solidity >=0.4.22;

contract Node {
    struct Site {
        uint id;
        string code;
        uint key;
    }

    mapping(uint => Site) public sites;
    uint public siteCount;

    event votedEvent (
        uint indexed _candidateId
    );

    constructor() public {
        // addSite("BRUH WHAT THE DOG DOIN");
        // addSite("lol?");
    }

    function addSite(string memory _name) public {
        siteCount++;
        sites[siteCount] = Site(siteCount, _name, 0);
    }

    function editSite(uint id, string memory _name) public {
        sites[id] = Site(id, _name, 0);
    }
}