pragma solidity ^0.4.9;

import "../interfaces/Owned.sol";
import "./AbstractENS.sol";
import "./USNResolvable.sol";

/// @title the main regstry for all contracts based on the USN-Names
contract USNResolver is Owned {

  /// the ENS-address
  AbstractENS public ens;

  /// the rootNode pointing to the hash of `usn.eth`
  bytes32 public rootNode;

  /// a whitelist of runtime-code-hashes for verified contracts
  /// all contracts in types are whitelisted
  mapping(bytes32 => bool)    public whitelist;  // holding the sha56-hash of all allowed registry contracts

  /// mapping of the nodeid to the contract address
  mapping(bytes32 => address) public objects; 

  /// mapping of the nodeid to a IPFS-Hash, which describes the chain this contract is deployed.
  mapping(bytes32 => bytes32) public chain;  

  /// public libraries-mapping
  mapping(bytes4 => address) public lib;

  /// triggered whenever a new contract-code is added to the whitelist
  event LogWhiteListUpdated(bytes32 _type, bool _allowed);

  /// triggered whenever a library was updated
  event LogLibUpdated(bytes4 _type, address newAddress);

  /// triggered when a new Object-contract has been added
  event LogAddedObject(bytes32 _nodeID);

  /// triggered when a object-contract has been removed
  event LogRemovedObject(bytes32 _nodeID);
  
  /// triggers a event whenever a address changes. See ENS-Resolver in EIP-137 
  event AddrChanged(bytes32 indexed node, address a);
  
  function USNResolver(AbstractENS _ens, bytes32 _rootNode) public Owned() {
    ens = _ens;
    rootNode = _rootNode;
  }

  function () public {revert();}

  /// whitelists the code of existing contract
  /// @param _address the address of the deployed contract
  /// @param _allow flag indicating if this should be allowed or not
  function setWhitelisted(address _address, bool _allow) public onlyOwner {
    bytes32 codeHash = keccak256(getCodeAt(_address));
    whitelist[codeHash] = _allow;
    LogWhiteListUpdated(codeHash,_allow);
  }

  /// whitelists the code of not deployed contract
  /// @param _codeHash the runtime-bin-hash of the contract
  /// @param _allow flag indicating if this should be allowed or not
  function setWhitelistedCode(bytes32 _codeHash, bool _allow) public onlyOwner {
    whitelist[_codeHash] = _allow;
    LogWhiteListUpdated(_codeHash,_allow);
  }

  /// changes the address of existing or new contract.
  /// @param _subnode the hash of the name registered
  /// @param newContract the address of the contract
  function setAddress(bytes32 _subnode,  USNResolvable newContract) public {
    bytes32 node = keccak256(rootNode, _subnode);
    require (isWhitelisted(newContract) && ens.owner(node) == msg.sender && newContract.ens() == ens && newContract.rootNode() == rootNode);
    objects[node] = newContract;
    AddrChanged(node,newContract);
  }

  /// sets or changes a address for a contract, which is not deployed in the same chain.
  /// @param _subnode the hash of the name registered
  /// @param _newAddress the address of the contract
  /// @param _chainIPFS the IPFS-Hash of the chain-defintion
  function setAddressInChain(bytes32 _subnode, address _newAddress, bytes32 _chainIPFS) public onlyOwner {
    bytes32 node = keccak256(rootNode, _subnode);
    objects[node] = _newAddress;
    chain[node] = _chainIPFS;
    AddrChanged(node,_newAddress);
  }

  /// returns true, if the code of the given address would be whitelisted
  /// @param _address the address of the deployed contract
  function isWhitelisted(address _address) public constant returns (bool) {
    return whitelist[keccak256(getCodeAt(_address))];
  }

  
  /// resolves the address for the given nodeid
  /// @param _nodeID the hash of of the rootNode+ hash of the name
  function addr(bytes32 _nodeID)  public constant returns (address) {
    return _nodeID == rootNode ? address(this) : objects[_nodeID];
  }

  /// sets a library-contract
  /// @param _id the hash or id of the interface
  /// @param _lib the address
  function setLib(bytes4 _id, address _lib) public onlyOwner {
    lib[_id] = _lib;
    LogLibUpdated(_id, _lib);
  }

  /// returns true if the given interface is supported
  /// @param _interfaceID the 4 bytes-hash of the interface
  function supportsInterface(bytes4 _interfaceID) public pure returns (bool) {
    return  _interfaceID == 0x3b3b57de;
  }

  /// returns the code for a given address
  function getCodeAt(address _addr) public view returns (bytes o_code) {
      assembly {
          // retrieve the size of the code, this needs assembly
          let size := extcodesize(_addr)
          // allocate output byte array - this could also be done without assembly
          // by using o_code = new bytes(size)
          o_code := mload(0x40)
          // new "memory end" including padding
          mstore(0x40, add(o_code, and(add(add(size, 0x20), 0x1f), not(0x1f))))
          // store length in memory
          mstore(o_code, size)
          // actually retrieve the code, this needs assembly
          extcodecopy(_addr, add(o_code, 0x20), 0, size)
      }
  }
}
