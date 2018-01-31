pragma solidity ^0.4.16;

/// @title control the access for a device.
/// @author slock.it
contract AccessSupport {
 
    /// interface-id for supportInterface-check
    bytes4 internal constant ID = 0xd1559fbc;

    /// verifies whther the user is in control or has access to the device.
    /// @param id the deviceid
    /// @param user the user on which this depend.
    /// @param action constant which the user wants to execute
    /// @return if the user has access with that action
    function canAccess(bytes32 id, address user, bytes4 action) external constant returns (bool);


}