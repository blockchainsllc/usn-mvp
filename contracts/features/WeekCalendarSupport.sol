pragma solidity ^0.4.16;



/// @title supports controlling acces by setting opening times per weekday
contract WeekCalendarSupport {
     /// interface-id for supportInterface-check
     bytes4 internal constant ID = 0xa7f26b04;

     /// a bitmask for 24*7 bits where each set bit is blocking and signals closed
     /// @param id deviceid
     function blockedTimes(bytes32 id) external constant returns (uint);

     /// a bitmask for 24*7 bits where each set bit is blocking and signals closed
     /// @param id deviceid
     /// @param _blockedTimes blocked times
     function setBlockedTimes(bytes32 id, uint _blockedTimes ) external;

     /// checks if this is closed
     /// @param id deviceid
     /// @param time intended accesstime
     function isBlocked(bytes32 id, uint64 time) public constant returns (bool);

}
