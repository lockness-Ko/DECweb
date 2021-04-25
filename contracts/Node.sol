pragma solidity >=0.4.22;

contract Node {
    struct Site {
        uint id;
        string code;
        uint key;
    }

    mapping(uint => Site) public sites;
    uint public siteCount;
    mapping(address => bool) public voters;

    event votedEvent (
        uint indexed _candidateId
    );

    constructor() public {
        addSite("BRUH WHAT THE DOG DOIN");
        addSite("lol?");
    }

    function addSite(string memory _name) private {
        siteCount++;
        sites[siteCount] = Site(siteCount, _name, 0);
    }
    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= siteCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        sites[_candidateId].key ++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }
}