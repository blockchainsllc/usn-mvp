pragma solidity ^0.4.16;
import "../features/OwnerSupport.sol";


/// @title supports for signing messages by the device.
contract VerifiedDeviceSupport {
     /// interface-id for supportInterface-check
     bytes4 public constant ID = 0xa3951baf;

     /// returns the public address of the 
     function devicePubKey(bytes32 id) public constant returns (bytes32);

     /// sets the public address of the 
     function setDevicePubKey(bytes32 id, bytes32 _address) public;

}


/// @title supports for signing messages by the device with one signature per device.
contract VerifiedDeviceSupportPerDeviceImpl is VerifiedDeviceSupport, OwnerSupport {

    /// the address
    mapping(bytes32 =>bytes32) deviceVerificationAddress;

    function devicePubKey(bytes32 _id) public constant returns (bytes32) {
        return deviceVerificationAddress[_id];
   }

    /// set the device address
    /// @param _id device id
    /// @param _address address
    function setDevicePubKey(bytes32 _id, bytes32 _address) public{
        require(deviceOwner(_id)==msg.sender);
        deviceVerificationAddress[_id] = _address;
    }
}

/// @title the Implementation for a whitelist for all devices in this contract.
contract VerifiedDeviceSupportPerContractImpl is OwnerSupport,VerifiedDeviceSupport {
    /// the address
    bytes32 public deviceVerificationAddress;

    /// returns the public address of the 
    function devicePubKey(bytes32 /*id*/) public constant returns (bytes32) {
        return deviceVerificationAddress;
    }

    /// set the device address
    /// @param _id device id
    /// @param _address address
    function setDevicePubKey(bytes32 _id, bytes32 _address) public{
        require (deviceOwner(_id)==msg.sender) ;
        deviceVerificationAddress = _address;
    }
}