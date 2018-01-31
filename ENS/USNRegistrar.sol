pragma solidity ^0.4.9;

import "../interfaces/Owned.sol";
import "./AbstractENS.sol";

/// @title this contract may be used to register new names for the usn-domain.
contract USNRegistrar is Owned {

    AbstractENS public ens;
    bytes32 public rootNode;
    address admin;
    uint public difficulty;

    function USNRegistrar(AbstractENS _ens, bytes32 _rootNode)  public Owned() {
        ens = _ens;
        rootNode = _rootNode;
        admin = owner;
        difficulty = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    }
    
    function () public {revert();}


    function setDifficulty(uint val) public onlyOwner {
        difficulty = val;
    }

    function setAdmin(address _admin) public onlyOwner {
        admin = _admin;
    }

    // first come first serve ...  consider selling nice names ...
    function registerObject(bytes32 _subnode, address _owner) public {
        // in order to use real names, the message must be sent by the admin
       // if (uint(_subnode) > difficulty && msg.sender!=admin) throw;

        require (uint(_subnode) < difficulty || msg.sender==admin);
        var node = keccak256(rootNode, _subnode);
        var currentOwner = ens.owner(node);

        require (currentOwner == 0 || currentOwner == msg.sender);

        ens.setSubnodeOwner(rootNode, _subnode, _owner);
    }

    function updateRegistrar(address _newRegistrar) public onlyOwner {
        ens.setOwner(rootNode, _newRegistrar);
    }

    function setResolver(address resolver) public onlyOwner {
        ens.setResolver(rootNode, resolver);
    }
}