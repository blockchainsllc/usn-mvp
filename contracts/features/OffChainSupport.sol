pragma solidity ^0.4.16;

/// @title defines Rules, which can be verified, even if the state is held on chain.
contract OffChainSupport {

    /// interface-id for supportInterface-check
    bytes4 internal constant ID = 0x3d8a1e6b;

    /// checks if the renting would be valid given the previous state and passed parameters
    /// @param id deviceid
    /// @param secondsToRent timespan for the rent
    /// @param amount amount the user will pay
    /// @param token token the user will use for payment
    /// @param user user trying to rent the device
    /// @param tokenReceiver receiver of the tokens / payments
    /// @param controllerBefore current controller of the device
    /// @param rentedUntilBefore current timestamp for the end of a rent
    /// @param depositBefore current deposit of the user
    /// @return error, rentedUntilAfter, usedDeposit and depositAccess
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
    ) 
    external constant returns (uint16 error);

    /// checks if the user would have access if under the given state
    /// @param id deviceid
    /// @param user user trying to rent the device
    /// @param action intended action
    /// @param controller current controller of the device
    /// @param rentedUntil planned end of the rent
    /// @param properties properties of the device
    /// @return if the user can access the object
    function canAccessIf(
        bytes32 id, 
        address user, 
        bytes4 action, 
        address controller, 
        uint64 rentedUntil, 
        uint128 properties
    ) 
        public constant returns (bool) ;
}

