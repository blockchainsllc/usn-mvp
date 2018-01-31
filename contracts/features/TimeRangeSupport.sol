pragma solidity ^0.4.16;


/// @title supports checks for a minimum and maximum time to rent
contract TimeRangeSupport {
    /// interface-id for supportInterface-check
     bytes4 public constant ID = 0x51533fb7;

    /// returns the minimum and maximun time this device can be rented
    /// @param id the device id
    function getRangeSeconds(bytes32 id) public constant returns (uint32 min, uint32 max);

    /// sets the minimum and maximun time this device can be rented
    /// @param id the device id
    /// @param min the minimum time in seconds or 0 if there is no limit
    /// @param max the maximun time in seconds or 0 if there is no limit
    function setRangeSeconds(bytes32 id, uint32 min, uint32 max) public;
}

