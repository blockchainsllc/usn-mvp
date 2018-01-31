pragma solidity ^0.4.16;


/// @title support controlling acces for only identifieable users, which can be based on keybase or other whitleists
contract DiscountSupport {

    /// interface-id for supportInterface-check
    bytes4 public constant ID = 0xbe4adbf9;

    function setDiscountRule(uint64 ruleId, uint8 discountType, uint128 limit, uint128 _discount) public;

    /// the amount, which should price for rentinng the device
    /// @param id the deviceid
    /// @param user the user because prices may depend on the user (whitelisted or discount)
    /// @param secondsToRent the time of rental in seconds
    /// @param token the address of the token to pay (See token-addreesses for details)
    function discount(bytes32 id, address user, uint32 secondsToRent, address token, uint128 standardPrice) public constant returns (uint128);



}