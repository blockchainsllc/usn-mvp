pragma solidity ^0.4.16;

/// @title support  StateChannels
contract StateChannelSupport {
    /// interface-id for supportInterface-check
    bytes4 public constant ID = 0x5fa3718b;

    /// the address of the stateChannel manager
    function stateChannelMgr() public constant returns (address);

    /// check whether the single device is also allowing it
    function supportStateChannels(bytes32 id) public constant returns (bool);

}
