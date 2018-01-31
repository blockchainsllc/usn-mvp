pragma solidity ^0.4.16;

/// @title supports acces control for depending devices.
contract DependendAccessSupport {

    /// interface-id for supportInterface-check
    bytes4 public constant ID = 0x83b8c330;

    /// sets a list of contracts and deviceIds, which will also have access, if the user books this device.
    /// @param id the device id
    /// @param contracts the depending contracts
    /// @param ids the depending device ids
    function setDependingService(bytes32 id, address[] memory contracts,bytes32[] memory ids) public;

    /// returns a list of contracts and deviceIds, which will also have access, if the user books this device.
    /// @param id the device id
    function getDependingService(bytes32 id) public constant returns (address[] memory contracts,bytes32[] memory ids);

}