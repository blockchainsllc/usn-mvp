pragma solidity ^0.4.4;

contract EIP165 {
  /// checks, if the contract supports a certain feature by implementing the interface
  /// @param _interfaceID the hash or identifier of the interface
  function supportsInterface(bytes4 _interfaceID) public constant returns (bool);

}