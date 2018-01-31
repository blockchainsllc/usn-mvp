pragma solidity ^0.4.16;


/// @title supports saving a deposit and returning it afterwards
contract DepositSupport {
     /// interface-id for supportInterface-check
     bytes4 public constant ID = 0xd8533f34;

     event LogDepositStored(address indexed user, bytes32 indexed id, uint128 amount, address token, uint64 access);
     event LogDepositReturned(address indexed user, bytes32 indexed id, uint128 amount, address token);

     /// returns the deposit for the given user, which can be called after the wait-period
     function returnDeposit(address user, bytes32 id) payable public;

     /// stores a deposit for a user
     function storedDeposit(address user, bytes32 id) public constant returns (uint128 amount, address token, uint64 access);

     /// retrieves the currently stored deposit
     function deposit(bytes32 id, address user, uint32 secondsToRent, address token) public constant returns (uint128);

}
