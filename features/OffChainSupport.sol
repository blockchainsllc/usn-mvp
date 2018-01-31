pragma solidity ^0.4.16;

/// @title defines Rules, which can be verified, even if the state is held on chain.
contract OffChainSupport {

    /// interface-id for supportInterface-check
    bytes4 public constant ID = 0x3d8a1e6b;

    /// checks if the renting would be valid given the previous state and passed parameters
    function rentIf(
        bytes32 id, 
        uint32 secondsToRent, 
        uint128 amount, 
        address token, 
        address user, 
        bytes32 tokenReceiver,  
        address controllerBefore, 
        uint64 rentedUntilBefore, 
        uint128 depositBefore
    ) public constant returns (uint16 error, uint64 rentedUntilAfter, uint128 usedDeposit,  uint64 depositAccess);

    /// checks if the user would have access if under the given state
    function canAccessIf(bytes32 id, address user, bytes4 action, address controller, uint64 rentedUntil) public constant returns (bool) ;
}

