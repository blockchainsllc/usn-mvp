pragma solidity ^0.4.16;

/// support grouped devices, where the owner registers groups of same devices with one transaction
contract GroupedSupport {

    /// interface-id for supportInterface-check
    bytes4 internal constant ID = 0xd63efd21;

    /// returns the next deviceId 
    /// @param id deviceid
    /// @return nextid
    function nextID(bytes32 id) public constant returns (bytes32);

    /// returns the number of devices for the given group
    /// @param group group
    /// @return number of devices in a group
    function getCount(bytes32 group) public constant returns(uint64);
}

