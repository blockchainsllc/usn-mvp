pragma solidity ^0.4.16;

import "../features/OffChainSupport.sol";

/// @title support mutlisigs as controller of a device. In this case all keyholders have access when rented.
contract MultisigSupport {

    /// interface-id for supportInterface-check
    bytes4 public constant ID = 0x7a26de3a;

}
