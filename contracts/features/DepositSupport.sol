pragma solidity ^0.4.16;

import "../helpers/USNLib.sol";

/// @title supports saving a deposit and returning it afterwards
/// @author slock.it
contract DepositSupport {

    /// interface-id for supportInterface-check
    bytes4 internal constant ID = 0xd8533f34;

    // the key is sha3(address,id)
    mapping(bytes32 => USNLib.Deposit) internal deposits; 

    /// triggered when a deposit was stored
    event LogDepositStored(address indexed user, bytes32 indexed id, uint128 amount, address token, uint64 access);
    /// triggered when a deposit was returned
    event LogDepositReturned(address indexed user, bytes32 indexed id, uint128 amount, address token);

    /// returns the deposit for the given user, which can be called after the wait-period
    /// @param user the user that wants his deposit back
    /// @param id deviceid 
    function returnDeposit(address user, bytes32 id) public;

    /// gives information about the stored deposit of a user
    /// @param user the user with the deposit
    /// @param id deviceid
    /// @return amount, token and access for an user and a device
    function storedDeposit(address user, bytes32 id) external constant returns (uint128 amount, address token, uint64 access);

    /// calculates the needed deposit for a device
    /// @param id deviceid
    /// @param user user with deposit
    /// @param secondsToRent timespan of the rent
    /// @param token token used for payment   
    /// @return needed deposit to pay for renting that device
    function deposit(bytes32 id, address user, uint32 secondsToRent, address token) public constant returns (uint128);

}
