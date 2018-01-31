pragma solidity ^0.4.16;

import "../interfaces/ERC20.sol";
import "../interfaces/Owned.sol";
import "../features/WhitelistSupport.sol";
import "../features/AccessSupport.sol";
import "../features/MetaSupport.sol";
import "../features/OwnerSupport.sol";
import "../ENS/USNResolvable.sol";


/** simple Contract, which only controls the metadata and the access for devices. */
contract AccessOnly is AccessSupport, Owned, WhitelistSupport, MetaSupport, OwnerSupport, USNResolvable  {
    bytes4 public constant ACCESS_ONLY = 0xff000003;

    // owner values
    struct Object {

        // slot 1
        uint128 props;   //  16 bytes or 128 switches
        uint64 extra;   //  8 bytes or 128 switches

        // slot 2 
        bytes meta; // x -bytes

        //  slot 3
        mapping ( address => bool) access;
   }

  mapping(bytes32 => Object) public registry;
    
  function AccessOnly( AbstractENS _ens,  bytes32 _rootNode) public { 
      ens = _ens;
      rootNode = _rootNode;
  }
  
  function () public {revert();}

  function deviceOwner(bytes32 /*id*/) public constant returns (address) { 
      return owner; 
  }
  function meta(bytes32 id) public constant returns (bytes) { 
      return registry[id].meta; 
  }
  function properties(bytes32 id) public constant returns (uint128 props, uint64 extra) {
       return (registry[id].props,registry[id].extra); 
  }

  function canAccess(bytes32 id, address user, bytes4 /*action*/) public constant returns (bool) {
      return registry[id].access[user] || user==owner;
  }

  // features
  function supportsInterface(bytes4 _interfaceID) public constant returns (bool) {
      return _interfaceID == 0x3b3b57de || // address-resolver
          _interfaceID == AccessSupport.ID ||
          _interfaceID == WhitelistSupport.ID ||
          _interfaceID == OwnerSupport.ID ||
          _interfaceID == MetaSupport.ID ||
          _interfaceID == WhitelistSupport.ID;
  }

  function setAccessWhitelist(bytes32 id, address user, bool hasAccess) onlyOwner public {
      registry[id].access[user]=hasAccess;
      LogAccessChanged(id,user,hasAccess);
  }

  // register
  function setObject(bytes32 _id, bytes _meta, uint128 props) onlyOwner public {
      Object storage object = registry[_id];
      object.meta = _meta;
      object.props = props;
      // we use a fixed static bytes32 here in order to filter these events with the bloom-filter!
      LogDeviceChanged(MetaSupport.BloomConstant , _id, _id);
  }


}