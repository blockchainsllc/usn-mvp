pragma solidity ^0.4.16;



/// @title supports controlling acces by setting opening times per weekday
contract WeekCalendarSupport {
     /// interface-id for supportInterface-check
     bytes4 public constant ID = 0xa7f26b04;

     /// a bitmask for 24*7 bits where each set bit is blocking and signals closed
     function blockedTimes(bytes32 id) public constant returns (uint);
     /// a bitmask for 24*7 bits where each set bit is blocking and signals closed
     function setBlockedTimes(bytes32 id, uint _blockedTimes ) public;

     /// checks if this is closed
     function isBlocked(bytes32 id, uint64 time) public constant returns (bool);

}
