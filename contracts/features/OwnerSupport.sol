pragma solidity ^0.4.16;

/// @title defines a owner for a device
contract OwnerSupport {
 
    /// interface-id for supportInterface-check
    bytes4 internal constant ID = 0xb4762fab;

    /// the owner of the device
    /// @param id the deviceid
    function deviceOwner(bytes32 id) public constant returns (address);


}