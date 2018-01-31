pragma solidity ^0.4.16;


/// @title support controlling acces for only identifieable users, which can be based on keybase or other whitleists
contract DiscountSupport {

    /// interface-id for supportInterface-check
    bytes4 internal constant ID = 0xbe4adbf9;

    /// defines a new rule for discounts
    /// @param ruleId ruleid
    /// @param discountType type of the discount
    /// @param limit limit of the discount
    /// @param _discount discount
    function setDiscountRule(uint64 ruleId, uint8 discountType, uint128 limit, uint128 _discount) external;

    /// the amount, which should price for rentinng the device
    /// @param id the deviceid
    /// @param user the user because prices may depend on the user (whitelisted or discount)
    /// @param secondsToRent the time of rental in seconds
    /// @param token the address of the token to pay (See token-addreesses for details)
    function discount(bytes32 id, address user, uint32 secondsToRent, address token, uint128 standardPrice) external constant returns (uint128);



}