pragma solidity ^0.4.16;


/// @title support controlling acces for only identifieable users, which can be based on keybase or other whitleists
contract IdentitySupport {

    /// interface-id for supportInterface-check
    bytes4 public constant ID = 0xf9378cb2;

    /// returns tru if the user can be identified.
    function isIdentified(address user) public constant returns (bool);
}