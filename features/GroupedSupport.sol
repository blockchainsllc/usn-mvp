pragma solidity ^0.4.16;

/// support grouped devices, where the owner registers groups of same devices with one transaction
contract GroupedSupport {

    /// interface-id for supportInterface-check
    bytes4 public constant ID = 0xd63efd21;

    /// returns the next deviceId 
    function nextID(bytes32 id) public constant returns (bytes32);

    /// returns the number of devices for the given group
    function getCount(bytes32 group) public constant returns(uint64);
}

