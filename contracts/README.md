
## interfaces

* `interface` [ERC20](https://github.com/slockit/usn-lib/blob/develop/contracts/interfaces/README.md#interface-erc20)    
* `interface` [Fees](https://github.com/slockit/usn-lib/blob/develop/contracts/interfaces/README.md#interface-fees)    
* `class` [Owned](https://github.com/slockit/usn-lib/blob/develop/contracts/interfaces/README.md#class-owned)    
* `interface` [EIP165](https://github.com/slockit/usn-lib/blob/develop/contracts/interfaces/README.md#interface-eip165)    

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
    
* `interface` [StateChannelSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-statechannelsupport)    
    support  StateChannels    
    
* `interface` [RemoteFeatureProvider](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-remotefeatureprovider)    
    interface for a remote feature-contract    
    
* `class` [MultisigSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#class-multisigsupport)    
    support mutlisigs as controller of a device. In this case all keyholders have access when rented.    
    
* `interface` [IdentitySupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-identitysupport)    
    support controlling acces for only identifieable users, which can be based on keybase or other whitleists    
    
* `interface` [GroupedSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-groupedsupport)    
* `interface` [DiscountSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-discountsupport)    
    support controlling acces for only identifieable users, which can be based on keybase or other whitleists    
    
* `interface` [DependendAccessSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-dependendaccesssupport)    
    supports acces control for depending devices.    
    
* `interface` [BlackListSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-blacklistsupport)    
    defines a blacklist for users to be rejected    
    
* `interface` [DepositSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-depositsupport)    
    supports saving a deposit and returning it afterwards    
    
* `interface` [RentForSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-rentforsupport)    
    renting from a different account then the controller    
    
* `interface` [OffChainSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-offchainsupport)    
    defines Rules, which can be verified, even if the state is held on chain.    
    
* `interface` [TimeRangeSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-timerangesupport)    
    supports checks for a minimum and maximum time to rent    
    
* `interface` [RemoteFeatureSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-remotefeaturesupport)    
    support controlling acces for only identifieable users, which can be based on keybase or other whitleists    
    
* `interface` [AccessSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-accesssupport)    
    control the access for a device.    
    
* `interface` [RentingSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-rentingsupport)    
    defines a contract able to rent and return    
    
* `interface` [MetaSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-metasupport)    
    returns metadata for a device    
    
* `interface` [OwnerSupport](https://github.com/slockit/usn-lib/blob/develop/contracts/features/README.md#interface-ownersupport)    
    defines a owner for a device    
    

## ENS

* `class` [USNResolver](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/README.md#class-usnresolver)    
    the main regstry for all contracts based on the USN-Names    
    
* `class` [USNRegistrar](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/README.md#class-usnregistrar)    
    this contract may be used to register new names for the usn-domain.    
    
* `class` [ENSOwner](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/README.md#class-ensowner)    
    interface used to check for the owner of given ENS-Nodeid    
    
* `class` [ENSImpl](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/README.md#class-ensimpl)    
* `interface` [AbstractENS](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/README.md#interface-abstractens)    
* `class` [USNResolvable](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/README.md#class-usnresolvable)    

## BaseRegistries

* `interface` [StandardObjects](https://github.com/slockit/usn-lib/blob/develop/contracts/BaseRegistries/README.md#interface-standardobjects)    
    This is the default implementation and base for most contracts.    
    
* `interface` [BasicFeaturedRentRegistry](https://github.com/slockit/usn-lib/blob/develop/contracts/BaseRegistries/README.md#interface-basicfeaturedrentregistry)    
    base class for features and Deposit-Handling without the defined storage    
    

## helpers

* `class` [USNLib](https://github.com/slockit/usn-lib/blob/develop/contracts/helpers/README.md#class-usnlib)    
    library for USN-contracts    
    
* `class` [FeesImpl](https://github.com/slockit/usn-lib/blob/develop/contracts/helpers/README.md#class-feesimpl)    

## profiles

* `class` [ProfileRegistry](https://github.com/slockit/usn-lib/blob/develop/contracts/profiles/README.md#class-profileregistry)    

## states

* `class` [StateChannelManager](https://github.com/slockit/usn-lib/blob/develop/contracts/states/README.md#class-statechannelmanager)    

## test

* `class` [FixedSupplyToken](https://github.com/slockit/usn-lib/blob/develop/contracts/test/README.md#class-fixedsupplytoken)    
* `class` [RemoteFeatureTest](https://github.com/slockit/usn-lib/blob/develop/contracts/test/README.md#class-remotefeaturetest)    

## types

* `class` [SingleOwnerObjectsFeatured](https://github.com/slockit/usn-lib/blob/develop/contracts/types/README.md#class-singleownerobjectsfeatured)    
* `class` [MultiOwnerObjectsFeatured](https://github.com/slockit/usn-lib/blob/develop/contracts/types/README.md#class-multiownerobjectsfeatured)    
* `class` [MultiOwnerObjects](https://github.com/slockit/usn-lib/blob/develop/contracts/types/README.md#class-multiownerobjects)    
* `class` [SingleOwnerGroupedObjectsFeatured](https://github.com/slockit/usn-lib/blob/develop/contracts/types/README.md#class-singleownergroupedobjectsfeatured)    
* `class` [SingleOwnerGroupedObjects](https://github.com/slockit/usn-lib/blob/develop/contracts/types/README.md#class-singleownergroupedobjects)    
* `class` [SingleOwnerObjects](https://github.com/slockit/usn-lib/blob/develop/contracts/types/README.md#class-singleownerobjects)    
* `class` [AccessOnly](https://github.com/slockit/usn-lib/blob/develop/contracts/types/README.md#class-accessonly)    
