pragma solidity ^0.4.16;

/// @title control the access for a device.
contract AccessSupport {
 
    /// interface-id for supportInterface-check
    bytes4 public constant ID = 0xd1559fbc;

    /// verifies whther the user is in control or has access to the device.
    /// @param id the deviceid
    /// @param user the user on which this depend.
    /// @param action constant which the user wants to execute
    function canAccess(bytes32 id, address user, bytes4 action) public constant returns (bool);


}