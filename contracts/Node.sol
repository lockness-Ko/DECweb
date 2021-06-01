pragma solidity >=0.4.22;

contract Node {
    struct Site {
        uint id;
        string code;
        uint key;
        uint chunkCount;
        mapping(uint => Chunk) public chunks;
    }

    struct Chunk {
        uint belongs;
        string data;
    }

    mapping(uint => Site) public sites;
    uint public siteCount;

    constructor() public {
        // addSite("BRUH WHAT THE DOG DOIN");
        // addSite("lol?");
    }

    function addSite(uint key, string memory code) public {
        siteCount++;
        sites[siteCount] = Site(siteCount, code, key);
    }

    function addChunk(uint id, uint key, string memory code) {
        chunkCount++;
        if(sites[id].key != key) {
            //YOU BROKE THE RULES (silent error, confirmation is on the frontend)
        }
        else {
            sites[id].chunks[chunkCount] = Chunk(id, code);
        }
    }

    function editSite(uint id, uint key, string memory code) public {
        if(sites[id].key != key) {
            //YOU BROKE THE RULES (silent error, confirmation is on the frontend)
        }
        else {
            sites[id] = Site(id, code, key);
        }
    }
}