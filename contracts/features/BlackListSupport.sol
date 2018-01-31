pragma solidity ^0.4.16;

/// @title defines a blacklist for users to be rejected
contract BlackListSupport {
 
    /// interface-id for supportInterface-check
    bytes4 public constant ID = 0xa3fb4905;

    /// changes the blacklist
    /// @param id device id
    /// @param user the user to check
    /// @param forbidden if true he will be blacklisted
    function setBlacklisted(bytes32 id, address user, bool forbidden) public;

    /// checks if a user is blacklisted
    /// @param id device id
    /// @param user the user to check
    function isBlacklisted(bytes32 id, address user) public constant returns (bool);

}