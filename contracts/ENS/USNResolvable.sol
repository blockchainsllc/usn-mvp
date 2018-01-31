pragma solidity ^0.4.0;
import "./AbstractENS.sol";

contract USNResolvable {
 
    /// the ENS-address
    AbstractENS public ens;

    /// the rootNode pointing to the hash of `usn.eth`
    bytes32 public rootNode;

    /// the nodeId
    bytes32 public subNode;

}