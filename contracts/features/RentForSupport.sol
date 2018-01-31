pragma solidity ^0.4.16;

/// @title renting from a different account then the controller
contract RentForSupport {

    /// interface-id for supportInterface-check
    bytes4 public constant ID = 0xbf89d2ac;

    /// rents a device, which means it will change the state by setting the sender as controller.
    /// @param id the deviceid
    /// @param secondsToRent the time of rental in seconds
    /// @param token the address of the token to pay (See token-addreesses for details)
    /// @param controller the user which should be allowed to control the device.
    /// @param rentedFrom the start time for this rental
    function rentFor(bytes32 id, uint32 secondsToRent, address token, address controller, uint64 rentedFrom) public payable;

    /// rents a device, which means it will change the state by setting the sender as controller.
    /// @param id the deviceid
    /// @param secondsToRent the time of rental in seconds
    /// @param token the address of the token to pay (See token-addreesses for details)
    /// @param controller the user which should be allowed to control the device.
    function rentForNow(bytes32 id, uint32 secondsToRent, address token,  address controller) public payable {
        rentFor( id,  secondsToRent,  token,   controller, uint64(now));
    }

    /// cancels a booking
    /// @param id device id
    /// @param start the timestamp when the booking should start
    function removeBooking(bytes32 id, uint start) public;

    /// checks if a booking is possible
    /// @param user the booking user
    /// @param id device id
    /// @param start the timestamp when the booking should start
    /// @param secondsToRent the duration to book
    function canBeRented(bytes32 id, address user,uint64 start, uint32 secondsToRent) public view returns (bool);
}