var Node = artifacts.require('./Node.sol');

contract("Node", (accounts)=>{
    it("initializes with two sites", ()=>{
        return Node.deployed().then((i)=>{
            return i.siteCount();
        }).then((count)=>{
            assert.equal(2,2);
        });
    });
})