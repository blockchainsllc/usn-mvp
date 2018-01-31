
## ENS

* `class` [USNResolver](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/README.md#class-usnresolver)    
    the main regstry for all contracts based on the USN-Names    
    
* `class` [USNResolvable](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/README.md#class-usnresolvable)    
* `class` [USNRegistrar](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/README.md#class-usnregistrar)    
    this contract may be used to register new names for the usn-domain.    
    
* `class` [ENSOwner](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/README.md#class-ensowner)    
    interface used to check for the owner of given ENS-Nodeid    
    
* `class` [ENSImpl](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/README.md#class-ensimpl)    
* `interface` [AbstractENS](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/README.md#interface-abstractens)    

## interfaces

* `interface` [ERC20](https://github.com/slockit/usn-lib/blob/develop/contracts/interfaces/README.md#interface-erc20)    
* `interface` [EIP165](https://github.com/slockit/usn-lib/blob/develop/contracts/interfaces/README.md#interface-eip165)    
* `class` [Owned](https://github.com/slockit/usn-lib/blob/develop/contracts/interfaces/README.md#class-owned)    

## features

* `interface` [WhitelistSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-whitelistsupport)    
    Defines additional access for certain users, (like the cleaning lady in an appartment)    
    
* `interface` [WeekCalendarSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-weekcalendarsupport)    
    supports controlling acces by setting opening times per weekday    
    
* `interface` [VerifiedDeviceSupportPerDeviceImpl](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-verifieddevicesupportperdeviceimpl)    
    supports for signing messages by the device with one signature per device.    
    
* `interface` [VerifiedDeviceSupportPerContractImpl](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-verifieddevicesupportpercontractimpl)    
    the Implementation for a whitelist for all devices in this contract.    
    
* `interface` [VerifiedDeviceSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-verifieddevicesupport)    
    supports for signing messages by the device.    
    
* `interface` [TokenSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-tokensupport)    
    supports exchanges between different tokens    
    
* `interface` [TimeRangeSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-timerangesupport)    
    supports checks for a minimum and maximum time to rent    
    
* `interface` [StateChannelSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-statechannelsupport)    
    support  StateChannels    
    
* `interface` [RentingSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-rentingsupport)    
    defines a contract able to rent and return    
    
* `interface` [RentForSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-rentforsupport)    
    renting from a different account then the controller    
    
* `interface` [RemoteFeatureSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-remotefeaturesupport)    
    support controlling acces for only identifieable users, which can be based on keybase or other whitleists    
    
* `interface` [RemoteFeatureProvider](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-remotefeatureprovider)    
    interface for a remote feature-contract    
    
* `interface` [OwnerSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-ownersupport)    
    defines a owner for a device    
    
* `interface` [OffChainSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-offchainsupport)    
    defines Rules, which can be verified, even if the state is held on chain.    
    
* `class` [MultisigSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#class-multisigsupport)    
    support mutlisigs as controller of a device. In this case all keyholders have access when rented.    
    
* `interface` [MetaSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-metasupport)    
    returns metadata for a device    
    
* `interface` [IdentitySupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-identitysupport)    
    support controlling acces for only identifieable users, which can be based on keybase or other whitleists    
    
* `interface` [GroupedSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-groupedsupport)    
* `interface` [DiscountSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-discountsupport)    
    support controlling acces for only identifieable users, which can be based on keybase or other whitleists    
    
* `interface` [DepositSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-depositsupport)    
    supports saving a deposit and returning it afterwards    
    
* `interface` [DependendAccessSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-dependendaccesssupport)    
    supports acces control for depending devices.    
    
* `interface` [BlackListSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-blacklistsupport)    
    defines a blacklist for users to be rejected    
    
* `interface` [AccessSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-accesssupport)    
    control the access for a device.    
    

## impl

* `class` [AccessOnly](https://github.com/slockit/usn-lib/blob/develop/contracts/impl/README.md#class-accessonly)    
