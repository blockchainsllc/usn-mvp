pragma solidity ^0.4.16;

/// @title support controlling acces for only identifieable users, which can be based on keybase or other whitleists
contract RemoteFeatureSupport {

    uint64 constant FUNCTION_ACCESS = 1;
    uint64 constant FUNCTION_RENT = 2;
    uint64 constant FUNCTION_PRICE = 4;

    /// interface-id for supportInterface-check
    bytes4 public constant ID = 0xaf568c9b;
    function features(uint) public view returns (address feature, uint64 iface);
    function featureCount() public view returns (uint);

    function setRemoteFeature(address _addr, uint64 _interface) public;
    function removeRemoteFeature(address _addr) public returns (bool found);

}


/// @title interface for a remote feature-contract
contract RemoteFeatureProvider {
    function canAccessIf(address registry, bytes32 _id, address _user, bytes4 action, address _controller, uint64 _rentedUntil) public constant returns (bool);
    function canRentFor(address registry, bytes32 _id, uint32 _secondsToRent, address _token, address _controller, uint64 _rentedFrom, bool allowRefund) public constant returns (bool rentable, bool refund);
    function price(address registry, bytes32 id, address user, uint64 rentedFrom, uint32 secondsToRent, address token, uint128 srcPrice) public constant returns (uint128);
}
