
## Config

configuration-data, which represents the structure of the config-file.

*  [USNConfig](#usnconfig)

## Messages

messages use to communicate with a device.

*  [Signature](#signature)
*  [StateMessage](#statemessage)
*  [ActionMessage](#actionmessage)
*  [ErrorResponse](#errorresponse)
*  [ReadStateMessageResponse](#readstatemessageresponse)
*  [ReadStateMessageRequest](#readstatemessagerequest)

## Meta

Data provided or stored for each device in the USN.

*  [ContractFeatures](#contractfeatures)
*  [DeviceProperties](#deviceproperties)
*  [DeviceState](#devicestate)
*  [Metadata](#metadata)

## Config

configuration-data, which represents the structure of the config-file.

### USNConfig

the definition of the config-file.

```javascript
import {types} from 'usn-lib'
const uSNConfig:types.USNConfig = {
  eth: {
    clients: [
      'http://myremote-client:8545',
      'ws://mylocalclient:84',
      'myipc-path'
    ]
  },
  contracts: {},
  services: {
    stateServer: 'https://state-server-test.usn.slock.it',
    hub: 'https://hub-test-usn.slock.it',
    search: 'https://search-test-usn.slock.it'
  },
  configDir: '/etc/usn',
  logger: {
    colors: true,
    append: false,
    level: 'debug',
    file: 'usn.log',
    logRPC: false
  }
}
```
 See [config.yaml](../blob/develop/src/types/config.yaml)

*  **eth** `object` - ethereum- connection   
    properties: 
    *  **clients** `string[]` - the urls of the available clients. Each url must be either a http(s), ws-url or a ipc-path   
*  **contracts** `object` - a list of base-contracts   
    properties: 
    *  **profiles** `string<address>` - a simple map holding public profiles for addresses [ProfileRegistry.sol](https://github.com/slockit/usn-mvp/tree/develop/contracts/profiles)   
    *  **registry** `string<address>` - the [USN-Resolver](https://github.com/slockit/usn-mvp/blob/develop/contracts/ENS/USNResolver.sol)   
    *  **usnRegistrar** `string<address>` - the [USN-Registrar](https://github.com/slockit/usn-mvp/blob/develop/contracts/ENS/USNRegistrar.sol), used to register new ENS-Domains   
    *  **stateManager** `string<address>` - the [StatechannelManager](https://github.com/slockit/usn-mvp/tree/develop/contracts/states)   
*  **services** `object` - the Services of the USN   
    properties: 
    *  **stateServer** `string<uri>` - url of the statechannel manager   
    *  **hub** `string<uri>` - url of the message hub   
    *  **search** `string<uri>` - url of the search-service   
*  **configDir** `string` - the directory where to store all config-files.   
*  **logger** `object` - loggin-configuration   
    properties: 
    *  **colors** `boolean` - use colors in logfiles   
    *  **append** `boolean` - append logfile   
    *  **level** `string` - Loglevel   
     Must be one of the these values : `'debug`', `'info`', `'warn`', `'error`', `'verbose`', `'silly`'
    *  **file** `string` - path to the logfile   
    *  **logRPC** `boolean` - if true, all JSON-RPC-requests will be logged in the logfile in order to debug   

## Messages

messages use to communicate with a device.

### Signature

Verified ECDSA Signature.
Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.
For more visit [ECDSA Q&A]{@link https://bitcoin.stackexchange.com/questions/38351/ecdsa-v-r-s-what-is-v}


```javascript
import {types} from 'usn-lib'
const signature:types.Signature = {}
```
 See [messages.yaml](../blob/develop/src/types/messages.yaml)

*  **message** `string` - the message   
*  **messageHash** `string<bytes32>` (required)  - hash of the message   
*  **r** `string<hex>` (required)  - Positive non-zero Integer signature.r   
*  **s** `string<hex>` (required)  - Positive non-zero Integer signature.s   
*  **v** `string<hex>` (required)  - Calculated curve point, or identity element O.   
*  **signature** `string<hex>` - the concated signature of r+s+v   

### StateMessage

Message demanding DEVICE RENTAL STATE change.

```javascript
import {types} from 'usn-lib'
const stateMessage:types.StateMessage = {
  url: 'bike@myCompany',
  verification: {
    paymentType: 'fiat'
  },
  msgType: 'rent'
}
```
 See [messages.yaml](../blob/develop/src/types/messages.yaml)

*  **url** `string<usnUrl>` (required)  - the device identifier   
*  **rentedUntil** `integer` (required)  - Limit date of rental. After this date the stateMgr must set the device free for rent. 
    The value is a unix-timestamp in seconds since 1970.
       
*  **rentedFrom** `integer` - start of the rental, if not provided the default will be the current timestamp.
    The value is a unix-timestamp in seconds since 1970.
       
*  **controller** `string<address>` - address of the contract controller   
*  **verification** `object` - Message verification-data   
    properties: 
    *  **paymentType** `string` (required)  - Name of the module that handles the verification   
     Must be one of the these values : `'fiat`', `'eth`', `'btc`', `'stateChannel`'
    *  **data** `object` - Additional data object required for verification, depending on the paymentType   
        each key in this object will structure its value like: 
*  **msgType** `string` (required)  - Message source. Demand specific action.   
 Must be one of the these values : `'rent`', `'return`'
*  **handled** `boolean` - States that this message was handled by stateMgr.   
*  **verified** `boolean` - States that this message was verified by a verifier module.   

### ActionMessage

Message demanding DEVICE PHYSICAL STATE change.

```javascript
import {types} from 'usn-lib'
const actionMessage:types.ActionMessage = {
  msgType: 'action',
  url: 'bike@myCompany',
  signature: {}
}
```
 See [messages.yaml](../blob/develop/src/types/messages.yaml)

*  **msgId** `number`   
*  **msgType** `string` (required)  - marks the message as action message   
 Must be one of the these values : `'action`'
*  **url** `string<usnUrl>` (required)  - the human readable url of the device   
*  **timestamp** `integer` (required)  - Unix format timestamp (in seconds) of the message. Used to avoid using same message twice.   
*  **action** `string` (required)  - Abstract physical action. I.E. open, lock, detonate.   
*  **metadata** `object` - Object containing data that the physical device expects to trigger change of state.   
*  **signature** [Signature](#signature) (required)    
*  **handled** `boolean` - States that this message was handled by stateMgr.   
*  **verified** `boolean` - States that this message was verified by a verifier module.   

### ErrorResponse

Message send back in case of an error

```javascript
import {types} from 'usn-lib'
const errorResponse:types.ErrorResponse = {
  msgType: 'error',
  url: 'bike@myCompany',
  args: [
    null
  ],
  signature: {}
}
```
 See [messages.yaml](../blob/develop/src/types/messages.yaml)

*  **msgId** `number` - a unique id to identifiy the message   
*  **msgType** `string` (required)  - fixed type   
 Must be one of the these values : `'error`'
*  **url** `string<usnUrl>` (required)  - the human readable url of the device   
*  **timestamp** `integer` (required)  - the timestamp when this state was read from the device. this is a unix-timestamp in seconds.   
*  **error** `string` (required)  - the error-message   
*  **errkey** `string` - the key used to translate the message   
*  **args** `string[]` - the arguments   
*  **signature** [Signature](#signature) - the signature of the device itself in order to prove that these data are correct.   

### ReadStateMessageResponse

Message from the device with its current state, signed by the device in order to prove its authenticity

```javascript
import {types} from 'usn-lib'
const readStateMessageResponse:types.ReadStateMessageResponse = {
  msgType: 'readResponse',
  url: 'bike@myCompany',
  states: [
    {}
  ],
  physicalState: {
    domain: {
      services: [
        null
      ]
    }
  },
  signature: {}
}
```
 See [messages.yaml](../blob/develop/src/types/messages.yaml)

*  **msgId** `number` - a unique id to identifiy the message   
*  **msgType** `string` (required)  - fixed type   
 Must be one of the these values : `'readResponse`'
*  **url** `string<usnUrl>` (required)  - the human readable url of the device   
*  **timestamp** `integer` (required)  - the timestamp when this state was read from the device. this is a unix-timestamp in seconds.   
*  **states** `object[]`   
    the array must contain object of : 
    *  **controller** `string<address>` - the controller or null if not rented   
    *  **rentedUntil** `integer` - the timestamp until the current device is rented. this is a unix-timestamp in seconds.   
    *  **rentedFrom** `integer` - the starting timestamp of the booking. this is a unix-timestamp in seconds.   
*  **physicalState** `object` - the internal description of the device.   
    properties: 
    *  **internalId** `string` - internal id, which is mapped to the deviceId   
    *  **state** `string` - current state of the device.   
    *  **domain** `object` - domain or services offered by the device.   
        properties: 
        *  **name** `string` - internal name   
        *  **services** `string[]` - services offered by the device   
    *  **lastUpdated** `number` - timestamp   
*  **signature** [Signature](#signature) - the signature of the device itself in order to prove that these data are correct.   

### ReadStateMessageRequest

Requests a read message from the device. The signature is optional and it is used to authenticate the requestor of the information, in order to return more details.

```javascript
import {types} from 'usn-lib'
const readStateMessageRequest:types.ReadStateMessageRequest = {
  msgType: 'read',
  url: 'bike@myCompany',
  signature: {}
}
```
 See [messages.yaml](../blob/develop/src/types/messages.yaml)

*  **msgId** `number`   
*  **msgType** `string` (required)  - marks the message as read message   
 Must be one of the these values : `'read`'
*  **timestamp** `integer` (required)  - the timestamp when this state was read from the device. this is a unix-timestamp in seconds.   
*  **url** `string<usnUrl>` (required)  - the human readable url of the device   
*  **signature** [Signature](#signature) - Signature based on the above values. If signed and user has access to the device, the response may include additional values, like the location.   

## Meta

Data provided or stored for each device in the USN.

### ContractFeatures

a object with features supported by the contract itself. This is readonly and should be used to figure out what kind of information or function can be called on the contract.

```javascript
import {types} from 'usn-lib'
const contractFeatures:types.ContractFeatures = {
  singleOwner: true,
  multiOwner: false,
  accessOnly: false,
  accessWhiteList: false,
  grouped: false,
  stateChannel: true,
  timeRange: true,
  multiTokens: false,
  deposit: false,
  calendar: false,
  dependingAccess: false,
  blackList: false,
  identity: false,
  offChain: true,
  verifiedDevice: true,
  rentFor: true,
  discount: true,
  remoteFeature: true,
  owner: true,
  meta: true,
  access: true,
  renting: true
}
```
 See [meta.yaml](../blob/develop/src/types/meta.yaml)

*  **singleOwner** `boolean` (value=0xff000002)  - all devices in this contract are owned by the same owner, which is the owner of the contract. Its base class is `SingleOwnerObjects`   
*  **multiOwner** `boolean` (value=0xff000001)  - each device in this contract has its own owner and can only be update by this owner. Its base class is `MultiOwnerObjects`   
*  **accessOnly** `boolean` (value=0xff000003)  - this contract supports no renting out of devices, but offers a lit of access-functions. Its base class is `AccessOnly`   
*  **accessWhiteList** `boolean` (value=0xd63efd09)  - offers function to extend the access to certain addresses. The interface `AccessSupport` is implemented.   
*  **grouped** `boolean` (value=0xd63efd21)  - supports the creation of multiple items of one device with the same metadata and settings. its base class is `SingleOwnerGroupedObjects`   
*  **stateChannel** `boolean` (value=0x5fa3718b)  - supports statechannels. `StateChannelSupport` is implemented.   
*  **timeRange** `boolean` (value=0x51533fb7)  - a minimum and maximum time to rent is validated. `TimeRangeSupport` is implemented.   
*  **multiTokens** `boolean` (value=0xe1cae6fe)  - supports exchanging between different tokens. `MultiTokenSupport` is implemented.   
*  **deposit** `boolean` (value=0xd8533f34)  - supports the storage of a deposit when renting. `DepositSupport` is implemented.   
*  **calendar** `boolean` (value=0xa7f26b04)  - defines the times in a week when this device should be available. `WeekCalendarSupport` is implemented.   
*  **dependingAccess** `boolean` (value=0x83b8c330)  - supports acces to devices which depend on others   
*  **blackList** `boolean` (value=0xa3fb4905)  - allows to blacklist addresses. `BlackListSupport` is implemented.   
*  **identity** `boolean` (value=0xf9378cb2)  - allows only users, which are identifieable (keybe, post ident,...) to use this device. `IdentitySupport` is implemented.   
*  **offChain** `boolean` (value=0x3d8a1e6b)  - offers function to evaluate the state which is processed offchain. `OffChainSupport` is implemented.   
*  **multisig** `boolean` (value=0x7a26de3a)  - supports multisigs when calling canAccess. `MultisigSupport` is implemented.   
*  **verifiedDevice** `boolean` (value=0xa3951baf)  - supports public address in order to recover a signature from messages from the device.   
*  **rentFor** `boolean` (value=0xbf89d2ac)  - supports retning for a differetn time and a different user, which enables 100% privacy   
*  **discount** `boolean` (value=0xbe4adbf9)  - enables discount rules on prices   
*  **remoteFeature** `boolean` (value=0xaf568c9b)  - enables Features, which are not directly implemented inside the contracts, but in a remote contract   
*  **owner** `boolean` (value=0xb4762fab)  - defines a owner per device   
*  **meta** `boolean` (value=0xfb4ca7b3)  - defines metadata for the device   
*  **access** `boolean` (value=0xd1559fbc)  - control the access for a device.   
*  **renting** `boolean` (value=0xb2a80dea)  - defines a contract able to rent and return.   

### DeviceProperties

list of options per device

```javascript
import {types} from 'usn-lib'
const deviceProperties:types.DeviceProperties = {
  rentable: true,
  stateChannel: true,
  contractExec: true,
  refund: true,
  extendTime: true,
  identityRequired: false,
  bookingOffChain: false,
  bookingOnChain: true,
  acceptPending: false,
  searchable: true
}
```
 See [meta.yaml](../blob/develop/src/types/meta.yaml)

*  **rentable** `boolean` (value=0)  - marks a object as rentable   
*  **stateChannel** `boolean` (value=1)  - allows users to use statechannels   
*  **contractExec** `boolean` (value=2)  - allows users to send transaction directly to the contract.   
*  **refund** `boolean` (value=3)  - allows users to use the rent-function with noRefundd=false. This means the users will have a chance to get a backpay in case he returns the device earlier.   
*  **extendTime** `boolean` (value=4)  - if set the user can extend the renting time by calling rent again.   
*  **identityRequired** `boolean` (value=5)  - if true and the Identity-feature is supported it will only allow identified person to rent the device.   
*  **bookingOffChain** `boolean` (value=6)  - if true and the booking-feature is supported it will allow users to book a service off chain without a garantee.   
*  **bookingOnChain** `boolean` (value=7)  - if true and the booking-feature is supported it will allow users to book a service on chain with a garantee   
*  **acceptPending** `boolean` (value=8)  - if true devices may accept pending transaction and accept the risk of a double spend.   
*  **searchable** `boolean` (value=9)  - device is listed within the search-service   

### DeviceState

the available data for a device.

```javascript
import {types} from 'usn-lib'
const deviceState:types.DeviceState = {
  url: 'bike@mycompany',
  deviceId: '0x430ed88a4522388b82ce9b1f3cd8041d269bb6bd9922a61a0000000000000000',
  contract: '0x6e4BE57f78c4FC8BAF7bE71df143ed5D0A56668A',
  token: '0x0000000000000000000000000000000000000000',
  meta: {
    url: 'appartment@simon-house-mittweida',
    lang: {
      en: {
        name: 'my Appartment in the city'
      }
    },
    device: {
      name: 'lock',
      services: [
        'lock',
        'unlock'
      ]
    },
    location: {
      lng: 50.9855193,
      lat: 12.9802203
    },
    images: [
      {
        data: 'ipfs://QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t'
      }
    ],
    price: {
      timeunit: 3600
    },
    types: {
      apartment: {
        subType: 'house',
        size: 120,
        maxPersons: 3,
        wifi: true,
        heating: true,
        tv: true,
        lockableRooms: true,
        iron: true,
        hairdryer: true,
        washingMachine: true,
        dryer: true,
        kitchen: true,
        breakfast: true,
        lift: true,
        pool: true,
        fitness: true,
        freeParking: true,
        whirlpool: true,
        airCondition: true,
        animals: false,
        smoking: false,
        events: false,
        ambiente: 'country'
      },
      bike: {
        subType: 'road',
        riders: 1,
        gearing: 20,
        wheels: 2,
        childSeat: true,
        tacho: false,
        material: 'carbon',
        frame: 'portable',
        condition: 'new',
        target: 'men'
      },
      washingMachine: {
        subType: 'industrial',
        loading: 'heTopLoader',
        dryer: false,
        volume: 10,
        condition: 'new',
        efficiency: 'A+++'
      },
      sharingBox: {
        subType: 'standalone',
        condition: 'new'
      }
    }
  },
  pricePerHour: 10,
  bookings: [
    {}
  ],
  neededDeposit: 0,
  storedDeposit: {},
  timeRange: {
    min: 3600
  },
  owner: '0x5338d77B5905CdEEa7c55a1F3A88d03559c36D73',
  rentingState: {
    rentable: true,
    open: true,
    free: false,
    controller: '0x5338d77B5905CdEEa7c55a1F3A88d03559c36D73',
    rentedUntil: 1503657750,
    rentedFrom: 1503657750,
    states: [
      {}
    ],
    physicalState: {
      domain: {
        services: [
          null
        ]
      }
    }
  },
  supportedTokens: [
    '0x0000000000000000000000000000000000000000'
  ],
  properties: {
    rentable: true,
    stateChannel: true,
    contractExec: true,
    refund: true,
    extendTime: true,
    identityRequired: false,
    bookingOffChain: false,
    bookingOnChain: true,
    acceptPending: false,
    searchable: true
  },
  features: {
    singleOwner: true,
    multiOwner: false,
    accessOnly: false,
    accessWhiteList: false,
    grouped: false,
    stateChannel: true,
    timeRange: true,
    multiTokens: false,
    deposit: false,
    calendar: false,
    dependingAccess: false,
    blackList: false,
    identity: false,
    offChain: true,
    verifiedDevice: true,
    rentFor: true,
    discount: true,
    remoteFeature: true,
    owner: true,
    meta: true,
    access: true,
    renting: true
  }
}
```
 See [meta.yaml](../blob/develop/src/types/meta.yaml)

*  **url** `string<usnUrl>` (required)  - url   
*  **deviceId** `string<bytes32>` - the 32byte-deviceid of the device.   
*  **contract** `string<address>` - the address of the contract   
*  **token** `string<address>` - the token for the price   
*  **meta** [Metadata](#metadata) - the metadata for the device   
*  **devicePubKey** `string<bytes32>` - if a devicePubKey is available, it can be used to validate   
*  **pricePerHour** `number` - the price per hour   
*  **bookings** `object[]` - list of all current bookings including the current renting   
    the array must contain object of : 
    *  **rentedFrom** `number` - start time   
    *  **rentedUntil** `number` - end time   
    *  **controller** `string<address>` - adress of the user controlling the device.   
    *  **paid** `number` - price paid by the user   
*  **neededDeposit** `number` - deposit needed in order to rent it   
*  **storedDeposit** `object` - deposit already stored by the user   
    properties: 
    *  **amount** `number` - the amount of tokens stored   
    *  **token** `string<address>` - the token used whens storing   
    *  **access** `number` - the time the user would be able to claim the tokens back.   
*  **metaHash** `string` - the url of the IPFS-Hash used to store the metadata   
*  **timeRange** `object` - the range of the time to rent   
    properties: 
    *  **min** `number` - the minimal time in seconds   
    *  **max** `number` - the maximal time in seconds   
*  **count** `number` - the number of available devices (if grouped)   
*  **owner** `string<address>` - the owner of the device   
*  **rentingState** `object` - the current renting state   
    properties: 
    *  **rentable** `boolean` - if true the device can be rented   
    *  **open** `boolean` - if true the is open for the current time   
    *  **free** `boolean` - if true the device is not rented out currently   
    *  **controller** `string<address>` - the current controller or 0x if not rented   
    *  **rentedUntil** `number` - the time until the controller can use it. the time is UNIX-stamp on seconds since 1970.   
    *  **rentedFrom** `number` - the time when the controller could start to use it. the time is UNIX-stamp on seconds since 1970.   
    *  **timestamp** `integer` - the timestamp when this state was read from the device. this is a unix-timestamp in seconds.   
    *  **states** `object[]`   
        the array must contain object of : 
        *  **controller** `string<address>` - the controller or null if not rented   
        *  **rentedUntil** `integer` - the timestamp until the current device is rented. this is a unix-timestamp in seconds.   
        *  **rentedFrom** `integer` - the starting timestamp of the booking. this is a unix-timestamp in seconds.   
    *  **physicalState** `object` - the internal description of the device.   
        properties: 
        *  **internalId** `string` - internal id, which is mapped to the deviceId   
        *  **state** `string` - current state of the device.   
        *  **domain** `object` - domain or services offered by the device.   
            properties: 
            *  **name** `string` - internal name   
            *  **services** `string[]` - services offered by the device   
        *  **lastUpdated** `number` - timestamp   
*  **supportedTokens** `string<address>[]` - list of supported tokens   
*  **extra** `string<hex>` - extra-data stored for this device   
*  **properties** [DeviceProperties](#deviceproperties) - options per device   
*  **features** [ContractFeatures](#contractfeatures) - supported features of the contract   

### Metadata

The Metadata for the all devices.

```javascript
import {types} from 'usn-lib'
const metadata:types.Metadata = {
  url: 'appartment@simon-house-mittweida',
  lang: {
    en: {
      name: 'my Appartment in the city'
    }
  },
  device: {
    name: 'lock',
    services: [
      'lock',
      'unlock'
    ]
  },
  location: {
    lng: 50.9855193,
    lat: 12.9802203
  },
  images: [
    {
      data: 'ipfs://QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t'
    }
  ],
  price: {
    timeunit: 3600
  },
  types: {
    apartment: {
      subType: 'house',
      size: 120,
      maxPersons: 3,
      wifi: true,
      heating: true,
      tv: true,
      lockableRooms: true,
      iron: true,
      hairdryer: true,
      washingMachine: true,
      dryer: true,
      kitchen: true,
      breakfast: true,
      lift: true,
      pool: true,
      fitness: true,
      freeParking: true,
      whirlpool: true,
      airCondition: true,
      animals: false,
      smoking: false,
      events: false,
      ambiente: 'country'
    },
    bike: {
      subType: 'road',
      riders: 1,
      gearing: 20,
      wheels: 2,
      childSeat: true,
      tacho: false,
      material: 'carbon',
      frame: 'portable',
      condition: 'new',
      target: 'men'
    },
    washingMachine: {
      subType: 'industrial',
      loading: 'heTopLoader',
      dryer: false,
      volume: 10,
      condition: 'new',
      efficiency: 'A+++'
    },
    sharingBox: {
      subType: 'standalone',
      condition: 'new'
    }
  }
}
```
 See [meta.yaml](../blob/develop/src/types/meta.yaml)

*  **url** `string<usnUrl>` (required)  - the human readable url for the given device   
*  **lang** `object` (required)  - iso-language as key   
    each key in this object will structure its value like: 
    *  **name** `string` (required)  - the name or title of the device   
    *  **description** `string` - a longer description which also allows the owner to use markdown   
    *  **rules** `string` - rules and conditions layed out by the owner   
*  **device** `object` (required)  - description of the type and its services   
    properties: 
    *  **name** `string` (required)  - the devicetype   
    *  **services** `string[]` (required)  - supported actions   
*  **location** `object` (required)  - the location of the device   
    properties: 
    *  **lng** `number` (required)  - longtitude   
    *  **lat** `number` (required)  - latitude   
    *  **country** `string` - country-code as defined in ISO 3166-1   
    *  **street** `string` - the street including the housenumber   
    *  **city** `string` - city of the device   
    *  **zipcode** `string` - zipcode or postalcode   
*  **images** `object[]` - a list of images   
    the array must contain object of : 
    *  **data** `string` - the data-url.
        This url may contain base64-encoded images or support any of these protocls:
         - http://
         - https://
         - data:mime;encoding,
         - ipfs://
         - ipns://
         - swarm://
           
    *  **name** `string` - the title or name of a image   
*  **price** `object` (required)  - pricedefinition   
    properties: 
    *  **timeunit** `integer` (required)  - timeunit to show in seconds (3600 = 1 hour)   
*  **types** `object` - defines categories and their metadata. This can be used to find out the type of the Device.   
    properties: 
    *  **apartment** `object` - a apartment or room locked up with a doorlock.   
        properties: 
        *  **subType** `string` (required)  - the type of appartment   
         Must be one of the these values : `'house`', `'privateRoom`', `'sharedRoom`'
        *  **size** `number` (required)  - the size of the appartment in qm   
        *  **bathrooms** `integer` - number of bathrooms   
        *  **bedrooms** `integer` - number of bedrooms   
        *  **beds** `integer` - total number of beds   
        *  **maxPersons** `integer` - max number of persons   
        *  **wifi** `boolean` - wifi is available   
        *  **heating** `boolean` - heating-system   
        *  **tv** `boolean` - TV   
        *  **lockableRooms** `boolean` - Bedrooms can be locked   
        *  **iron** `boolean` - equipment to iron   
        *  **hairdryer** `boolean` - hairdryer   
        *  **washingMachine** `boolean` - existing washing machine   
        *  **dryer** `boolean` - existing dryer   
        *  **kitchen** `boolean` - appartment contains a kitchen   
        *  **breakfast** `boolean` - optional breakfast   
        *  **lift** `boolean` - lift exists   
        *  **pool** `boolean` - pool included   
        *  **fitness** `boolean` - fitness studio or room included   
        *  **freeParking** `boolean` - parking available   
        *  **whirlpool** `boolean` - whirlpool available   
        *  **airCondition** `boolean` - airCondition available   
        *  **animals** `boolean` - are animals allowed   
        *  **smoking** `boolean` - is smoking allowed   
        *  **events** `boolean` - are parties or events allowed   
        *  **checkIn** `string` - comments on when and how to check-in   
        *  **checkOut** `string` - comments on when and how to check-out   
        *  **ambiente** `string` - the ambiente or enviroment   
         Must be one of the these values : `'country`', `'innerCity`', `'nature`'
    *  **bike** `object` - a bike or vehicle to rent.   
        properties: 
        *  **subType** `string` (required)  - the type of the bike   
         Must be one of the these values : `'road`', `'touring`', `'hybrid`', `'cross`', `'utility`', `'freight`', `'mountain`', `'racing`', `'motorized`', `'firefighter`'
        *  **size** `number` (required)  - size of the bike   
        *  **brand** `string` - the brand   
        *  **build** `number` - year when the bike was build   
        *  **riders** `number` - number of riders   
        *  **gearing** `number` - number of gears   
        *  **wheels** `number` - number of wheels   
        *  **childSeat** `boolean` - contains a seat for children   
        *  **tacho** `boolean` - contains a tachometer or board computer   
        *  **material** `string` - the main material of the frame   
         Must be one of the these values : `'carbon`', `'luggedSteel`', `'bamboo`', `'plastic`'
        *  **frame** `string` - the design of the frame   
         Must be one of the these values : `'portable`', `'safety`', `'smallWheel`', `'folding`', `'prone`', `'recumbent`', `'pennyFarthing`'
        *  **condition** `string` - the current condition of the bike   
         Must be one of the these values : `'new`', `'used`', `'broken`'
        *  **target** `string` - target group   
         Must be one of the these values : `'men`', `'women`', `'children`'
    *  **washingMachine** `object` - a washing machine   
        properties: 
        *  **subType** `string` (required)  - the type of the machine   
         Must be one of the these values : `'industrial`', `'laundromat`', `'private`'
        *  **loading** `string` - the position for loading   
         Must be one of the these values : `'heTopLoader`', `'topLoader`', `'frontLoader`'
        *  **brand** `string` - the brand   
        *  **size** `number` (required)  - size of the bike   
        *  **dryer** `boolean` - dryer included   
        *  **volume** `number` - volume in L   
        *  **build** `number` - year when the washing machine was build   
        *  **condition** `string` - the current condition of the bike   
         Must be one of the these values : `'new`', `'used`', `'broken`'
        *  **efficiency** `string` - efficiency class   
         Must be one of the these values : `'A+++`', `'A++`', `'A+`', `'A`', `'B`', `'C`', `'D`', `'E`', `'F`', `'G`'
    *  **sharingBox** `object` - a box, which can be locked and used to share anything   
        properties: 
        *  **subType** `string` (required)  - the type of the box   
         Must be one of the these values : `'standalone`', `'grid`'
        *  **width** `number` - width of the box   
        *  **height** `number` - height of the box   
        *  **depth** `number` - depth of the box   
        *  **build** `number` - year when the washing machine was build   
        *  **condition** `string` - the current condition of the content   
         Must be one of the these values : `'new`', `'used`', `'broken`'
