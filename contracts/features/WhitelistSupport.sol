pragma solidity ^0.4.16;

import "../BaseRegistries/StandardObjects.sol";
import "../features/OffChainSupport.sol";

/// @title Defines additional access for certain users, (like the cleaning lady in an appartment)
contract WhitelistSupport {
  
  /// whenever the whitelist changes, an event must be triggered
  event LogAccessChanged(bytes32 indexed id, address indexed controller, bool permission);

  /// interface-id for supportInterface-check
  bytes4 internal constant ID = 0xd63efd09;

  /// changes values on the whitelist
  /// @param id device id
  /// @param user the user to put on the whitelist
  /// @param hasAccess true|false to give permission
  function setAccessWhitelist(bytes32 id, address user, bool hasAccess) external;
}