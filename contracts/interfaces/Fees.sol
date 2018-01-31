pragma solidity ^0.4.4;

contract Fees {

    /// interface-id for supportInterface-check 
    bytes4 public constant ID = 0x9bd12cb7;

    function  getFee(uint128 price, address token, address registry, address user, bytes32 id, uint64 time) public view returns (uint128 amount, address receiver);
    function  getAndUpdateFee(uint128 price, address token, address registry, address user, bytes32 id, uint64 time) public returns (uint128 amount, address receiver);
}
