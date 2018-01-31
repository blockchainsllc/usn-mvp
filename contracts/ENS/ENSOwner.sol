pragma solidity ^0.4.4;

import "./AbstractENS.sol";

/// @title interface used to check for the owner of given ENS-Nodeid
contract ENSOwner {
    AbstractENS public ens;
    modifier onlyENSOwner(bytes32 _nodeId) { require (ens.owner(_nodeId) == msg.sender); _; }

    /// @notice The Constructor stores the address of the ENS
    function ENSOwner(AbstractENS _ens)  public { ens = _ens;}

    function changeENS(AbstractENS _ens) internal {
        ens = _ens;
    }

    function getENSOwner(bytes32 _nodeId) public view returns(address) {return ens.owner(_nodeId);}
}
