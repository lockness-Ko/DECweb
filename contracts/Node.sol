pragma solidity >=0.4.22;

contract Node {
    struct Site {
        uint id;
        string code;
        uint views;
    }

    mapping(uint => Site) public sites;
    uint public siteCount;

    constructor() public {
        addSite("BRUH WHAT THE DOG DOIN");
        addSite("lol?");
    }

    function addSite(string memory _name) private {
        siteCount++;
        sites[siteCount] = Site(siteCount, _name, 0);
    }
}