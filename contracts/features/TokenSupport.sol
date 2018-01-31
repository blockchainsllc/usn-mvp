pragma solidity ^0.4.16;

/// @title supports exchanges between different tokens
contract TokenSupport {

    /// interface-id for supportInterface-check
    bytes4 internal constant ID = 0xe1cae6fe;

    /// sets the list of supported tokens
    /// @param id deviceid
    /// @param addresses array with supported token-addresses
    function setSupportedTokens(bytes32 id, address[] memory addresses) public;

    /// sets the receiver of a token
    /// @param id deviceid
    /// @param token supported token address
    /// @param newTarget new receiver of the tokens
    function setTokenReceiver(bytes32 id, address token, address newTarget) external;
}

