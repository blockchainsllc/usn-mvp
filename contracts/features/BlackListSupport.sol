pragma solidity ^0.4.16;

/// @title defines a blacklist for users to be rejected
/// @author slock.ot 
contract BlackListSupport {
 
    /// interface-id for supportInterface-check
    bytes4 internal constant ID = 0xa3fb4905;

    /// changes the blacklist
    /// @param id device id
    /// @param user the user to check
    /// @param forbidden if true he will be blacklisted
    function setBlacklisted(bytes32 id, address user, bool forbidden) external;

    /// checks if a user is blacklisted
    /// @param id device id
    /// @param user the user to check
    /// @return if the user if blacklisted for that device
    function isBlacklisted(bytes32 id, address user) external constant returns (bool);

}