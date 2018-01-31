pragma solidity ^0.4.16;

/// @title supports exchanges between different tokens
contract TokenSupport {

    /// interface-id for supportInterface-check
    bytes4 public constant ID = 0xe1cae6fe;

    /// sets the list of supported tokens
    function setSupportedTokens(bytes32 id, address[] memory addresses) public;
}

