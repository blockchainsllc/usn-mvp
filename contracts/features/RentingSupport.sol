pragma solidity ^0.4.16;

/// @title defines a contract able to rent and return
contract RentingSupport {
 
    /// interface-id for supportInterface-check
    bytes4 internal constant ID = 0xb2a80dea;

    /// created after the rent-function was executed
    event LogRented(bytes32 indexed fixFilter, bytes32 indexed id, address controller, uint64 rentedFrom, uint64 rentedUntil, bool noReturn, uint128 amount, address token, uint128 properties);
    /// whenever the device was returned.
    event LogReturned(bytes32 indexed fixFilter, bytes32 indexed id, address controller, uint64 rentedFrom, uint64 rentedUntil, uint128 paidBack);

    /// rents a device, which means it will change the state by setting the sender as controller.
    /// @param id the deviceid
    /// @param secondsToRent the time of rental in seconds
    /// @param token the address of the token to pay (See token-addreesses for details)
    function rent(bytes32 id, uint32 secondsToRent, address token) external payable;

    /// returns the Object or Device and also the funds are returned in case he returns it earlier than rentedUntil.
    /// @param id the deviceid
    function returnObject(bytes32 id) external;

    /// the price for rentinng the device
    /// @param id the deviceid
    /// @param user the user because prices may depend on the user (whitelisted or discount)
    /// @param secondsToRent the time of rental in seconds
    /// @param token the address of the token to pay (See token-addreesses for details)
    /// @return price to be payed for renting the device
    function price(bytes32 id, address user, uint32 secondsToRent, address token) public constant returns (uint128);

    /// a list of supported tokens for the given device
    /// @param id the deviceid
    /// @return array with supported tokens
    function supportedTokens(bytes32 id) public constant returns (address[] memory addresses);

    /// the receiver of the token, which may be different than the owner or even a Bitcoin-address. For fiat this may be hash of payment-data.
    /// @param id the deviceid
    /// @param token the paid token
    /// @return tokenRecevier in bytes32
    function tokenReceiver(bytes32 id, address token) public constant returns (bytes32);

    /// returns the current renting state
    /// @param user the user on which this may depend.
    /// @param id the deviceid
    /// @return rentable, free, open, controller, rentedUntil, rentedFrom and props of a device for a user
    function getRentingState(bytes32 id, address user) public constant returns (bool rentable, bool free, bool open, address controller, uint64 rentedUntil, uint64 rentedFrom, uint128 props);

    /// returns the current amount of renting states
    /// @param id deviceid
    /// @return amount of states of a device
    function getStateCount(bytes32 id) external view returns (uint);

    /// returns the important informations of a state 
    /// @param id deviceid
    /// @param index stateindex
    /// @return controller, rentedFrom, rentedUntil and properties of the given index beloning to the state
    function getState(bytes32 id, uint index) external view returns (address controller, uint64 rentedFrom, uint64 rentedUntil, uint128 properties);

}