pragma solidity ^0.4.16;

/// @title returns metadata for a device
contract MetaSupport {
 
    /// this constant is used as first arg in events, so a bloomfilter can filter events over all contracts. 
    bytes32 public constant BloomConstant = 0xa2f7689fc12ea917d9029117d32b9fdef2a53462c853462ca86b71b97dd84af6;

    /// marks a object as rentable
    uint128 public constant PROP_RENTABLE = 0x01;

    /// allows users to use statechannels
    uint128 public constant PROP_STATECHANNEL = 0x02;

    /// allows users to send transaction directly to the contract
    uint128 public constant PROP_CONTRACT_EXEC = 0x04;

    /// supports refund. This means the users will have a chance to get a backpay in case he returns the device earlier. 
    uint128 public constant PROP_REFUND = 0x08;

    /// if set the user can extend the renting time by calling rent again.
    uint128 public constant PROP_EXTEND_TIME = 0x10;

    /// if true and the Identity-feature is supported it will only allow identified person to rent the device.
    uint128 public constant PROP_IDENTITY_REQUIRED = 0x20;

    /// if true and the booking-feature is supported it will allow users to book a service off chain without a garantee.
    uint128 public constant PROP_BOOKING_OFFCHAIN = 0x40;

    /// if true and the booking-feature is supported it will allow users to book a service on chain with a garantee.
    uint128 public constant PROP_BOOKING_ONCHAIN = 0x80;

    /// interface-id for supportInterface-check
    bytes4 public constant ID = 0xfb4ca7b3;

    /// this event will be triggered for each object changed. In case we have endId, we can use the same values for all ids between the id and endId. the fix-filter is just the same id so we can create a bloom-filter to detect all changes.
    event LogDeviceChanged(bytes32 indexed fixFilter, bytes32 indexed id, bytes32 endId);
    /// created after the rent-function was executed

    /// the link to the metadata, which may also support ipfs:///...
    /// @param id the deviceid
    function meta(bytes32 id) public constant returns (bytes);

    /// the properties or behavior defined per device, which is a bitmask with well defined values. (See https://github.com/slockit/usn-lib/wiki/Types#deviceproperties)
    /// @param id the deviceid
    function properties(bytes32 id) public constant returns (uint128 props, uint64 extra);

}