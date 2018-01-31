pragma solidity ^0.4.16;


/// @title support controlling acces for only identifieable users, which can be based on keybase or other whitleists
contract IdentitySupport {

    /// interface-id for supportInterface-check
    bytes4 internal constant ID = 0xf9378cb2;

    /// returns tru if the user can be identified.
    /// @param user user
    /// @return if the user is identified
    function isIdentified(address user) public constant returns (bool);
}