import {ajv, validateAndThrow} from '../utils/validate'
import * as Ajv from 'ajv'
/**
 * a object with features supported by the contract itself. This is readonly and should be used to figure out what kind of information or function can be called on the contract.
 */
export interface ContractFeatures {
    /**
     * all devices in this contract are owned by the same owner, which is the owner of the contract. Its base class is `SingleOwnerObjects`
     * example: true
     */
    singleOwner?: boolean
    /**
     * each device in this contract has its own owner and can only be update by this owner. Its base class is `MultiOwnerObjects`
     */
    multiOwner?: boolean
    /**
     * this contract supports no renting out of devices, but offers a lit of access-functions. Its base class is `AccessOnly`
     */
    accessOnly?: boolean
    /**
     * offers function to extend the access to certain addresses. The interface `AccessSupport` is implemented.
     */
    accessWhiteList?: boolean
    /**
     * supports the creation of multiple items of one device with the same metadata and settings. its base class is `SingleOwnerGroupedObjects`
     */
    grouped?: boolean
    /**
     * supports statechannels. `StateChannelSupport` is implemented.
     * example: true
     */
    stateChannel?: boolean
    /**
     * a minimum and maximum time to rent is validated. `TimeRangeSupport` is implemented.
     * example: true
     */
    timeRange?: boolean
    /**
     * supports exchanging between different tokens. `MultiTokenSupport` is implemented.
     */
    multiTokens?: boolean
    /**
     * supports the storage of a deposit when renting. `DepositSupport` is implemented.
     */
    deposit?: boolean
    /**
     * defines the times in a week when this device should be available. `WeekCalendarSupport` is implemented.
     */
    calendar?: boolean
    /**
     * supports acces to devices which depend on others
     */
    dependingAccess?: boolean
    /**
     * allows to blacklist addresses. `BlackListSupport` is implemented.
     */
    blackList?: boolean
    /**
     * allows only users, which are identifieable (keybe, post ident,...) to use this device. `IdentitySupport` is implemented.
     */
    identity?: boolean
    /**
     * offers function to evaluate the state which is processed offchain. `OffChainSupport` is implemented.
     * example: true
     */
    offChain?: boolean
    /**
     * supports multisigs when calling canAccess. `MultisigSupport` is implemented.
     */
    multisig?: boolean
    /**
     * supports public address in order to recover a signature from messages from the device.
     * example: true
     */
    verifiedDevice?: boolean
    /**
     * supports retning for a differetn time and a different user, which enables 100% privacy
     * example: true
     */
    rentFor?: boolean
    /**
     * enables discount rules on prices
     * example: true
     */
    discount?: boolean
    /**
     * enables Features, which are not directly implemented inside the contracts, but in a remote contract
     * example: true
     */
    remoteFeature?: boolean
    /**
     * defines a owner per device
     * example: true
     */
    owner?: boolean
    /**
     * defines metadata for the device
     * example: true
     */
    meta?: boolean
    /**
     * control the access for a device.
     * example: true
     */
    access?: boolean
    /**
     * defines a contract able to rent and return.
     * example: true
     */
    renting?: boolean
}
/**
 * list of options per device
 */
export interface DeviceProperties {
    /**
     * marks a object as rentable
     * example: true
     */
    rentable?: boolean
    /**
     * allows users to use statechannels
     * example: true
     */
    stateChannel?: boolean
    /**
     * allows users to send transaction directly to the contract.
     * example: true
     */
    contractExec?: boolean
    /**
     * allows users to use the rent-function with noRefundd=false. This means the users will have a chance to get a backpay in case he returns the device earlier.
     * example: true
     */
    refund?: boolean
    /**
     * if set the user can extend the renting time by calling rent again.
     * example: true
     */
    extendTime?: boolean
    /**
     * if true and the Identity-feature is supported it will only allow identified person to rent the device.
     */
    identityRequired?: boolean
    /**
     * if true and the booking-feature is supported it will allow users to book a service off chain without a garantee.
     */
    bookingOffChain?: boolean
    /**
     * if true and the booking-feature is supported it will allow users to book a service on chain with a garantee
     * example: true
     */
    bookingOnChain?: boolean
    /**
     * if true devices may accept pending transaction and accept the risk of a double spend.
     */
    acceptPending?: boolean
    /**
     * device is listed within the search-service
     * example: true
     */
    searchable?: boolean
}
/**
 * the available data for a device.
 */
export interface DeviceState {
    /**
     * url
     * example: bike@mycompany
     */
    url: string // usnUrl
    /**
     * the 32byte-deviceid of the device.
     * example: 0x430ed88a4522388b82ce9b1f3cd8041d269bb6bd9922a61a0000000000000000
     */
    deviceId?: string // bytes32
    /**
     * the address of the contract
     * example: 0x6e4BE57f78c4FC8BAF7bE71df143ed5D0A56668A
     */
    contract?: string // address
    /**
     * the token for the price
     * example: 0x0000000000000000000000000000000000000000
     */
    token?: string // address
    /**
     * the metadata for the device
     */
    meta?: Metadata
    /**
     * if a devicePubKey is available, it can be used to validate
     */
    devicePubKey?: string // bytes32
    /**
     * the price per hour
     * example: 10
     */
    pricePerHour?: number
    /**
     * list of all current bookings including the current renting
     */
    bookings?: {
        /**
         * start time
         */
        rentedFrom?: number
        /**
         * end time
         */
        rentedUntil?: number
        /**
         * adress of the user controlling the device.
         */
        controller?: string // address
        /**
         * price paid by the user
         */
        paid?: number
    }[]
    /**
     * deposit needed in order to rent it
     */
    neededDeposit?: number
    /**
     * deposit already stored by the user
     */
    storedDeposit?: {
        /**
         * the amount of tokens stored
         */
        amount?: number
        /**
         * the token used whens storing
         */
        token?: string // address
        /**
         * the time the user would be able to claim the tokens back.
         */
        access?: number
    }
    /**
     * the url of the IPFS-Hash used to store the metadata
     */
    metaHash?: string
    /**
     * the range of the time to rent
     */
    timeRange?: {
        /**
         * the minimal time in seconds
         * example: 3600
         */
        min?: number
        /**
         * the maximal time in seconds
         */
        max?: number
    }
    /**
     * the number of available devices (if grouped)
     */
    count?: number
    /**
     * the owner of the device
     * example: 0x5338d77B5905CdEEa7c55a1F3A88d03559c36D73
     */
    owner?: string // address
    /**
     * the current renting state
     */
    rentingState?: {
        /**
         * if true the device can be rented
         * example: true
         */
        rentable?: boolean
        /**
         * if true the is open for the current time
         * example: true
         */
        open?: boolean
        /**
         * if true the device is not rented out currently
         */
        free?: boolean
        /**
         * the current controller or 0x if not rented
         * example: 0x5338d77B5905CdEEa7c55a1F3A88d03559c36D73
         */
        controller?: string // address
        /**
         * the time until the controller can use it. the time is UNIX-stamp on seconds since 1970.
         * example: 1503657750
         */
        rentedUntil?: number
        /**
         * the time when the controller could start to use it. the time is UNIX-stamp on seconds since 1970.
         * example: 1503657750
         */
        rentedFrom?: number
        /**
         * the timestamp when this state was read from the device. this is a unix-timestamp in seconds.
         */
        timestamp?: number
        states?: {
            /**
             * the controller or null if not rented
             */
            controller?: string // address
            /**
             * the timestamp until the current device is rented. this is a unix-timestamp in seconds.
             */
            rentedUntil?: number
            /**
             * the starting timestamp of the booking. this is a unix-timestamp in seconds.
             */
            rentedFrom?: number
        }[]
        /**
         * the internal description of the device.
         */
        physicalState?: {
            /**
             * internal id, which is mapped to the deviceId
             */
            internalId?: string
            /**
             * current state of the device.
             */
            state?: string
            /**
             * domain or services offered by the device.
             */
            domain?: {
                /**
                 * internal name
                 */
                name?: string
                /**
                 * services offered by the device
                 */
                services?: string[]
            }
            /**
             * timestamp
             */
            lastUpdated?: number
        }
    }
    /**
     * list of supported tokens
     */
    supportedTokens?: string /* address */ []
    /**
     * extra-data stored for this device
     */
    extra?: string // hex
    /**
     * options per device
     */
    properties?: DeviceProperties
    /**
     * supported features of the contract
     */
    features?: ContractFeatures
}
/**
 * The Metadata for the all devices.
 */
export interface Metadata {
    /**
     * the human readable url for the given device
     * example: appartment@simon-house-mittweida
     */
    url: string // usnUrl
    /**
     * iso-language as key
     */
    lang: {
        [name: string]: {
            /**
             * the name or title of the device
             * example: my Appartment in the city
             */
            name: string
            /**
             * a longer description which also allows the owner to use markdown
             */
            description?: string
            /**
             * rules and conditions layed out by the owner
             */
            rules?: string
        }
    }
    /**
     * description of the type and its services
     */
    device: {
        /**
         * the devicetype
         * example: lock
         */
        name: string
        /**
         * supported actions
         * example: lock,unlock
         */
        services: string[]
    }
    /**
     * the location of the device
     */
    location: {
        /**
         * longtitude
         * example: 50.9855193
         */
        lng: number
        /**
         * latitude
         * example: 12.9802203
         */
        lat: number
        /**
         * country-code as defined in ISO 3166-1
         */
        country?: string // [a-z0-9]{3}
        /**
         * the street including the housenumber
         */
        street?: string
        /**
         * city of the device
         */
        city?: string
        /**
         * zipcode or postalcode
         */
        zipcode?: string
    }
    /**
     * a list of images
     */
    images?: {
        /**
         * the data-url.
         * This url may contain base64-encoded images or support any of these protocls:
         *  - http://
         *  - https://
         *  - data:mimeencoding,
         *  - ipfs://
         *  - ipns://
         *  - swarm://
         * 
         * example: ipfs://QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t
         */
        data?: string
        /**
         * the title or name of a image
         */
        name?: string
    }[]
    /**
     * pricedefinition
     */
    price: {
        /**
         * timeunit to show in seconds (3600 = 1 hour)
         * example: 3600
         */
        timeunit: number
    }
    /**
     * defines categories and their metadata. This can be used to find out the type of the Device.
     */
    types?: {
        /**
         * a apartment or room locked up with a doorlock.
         */
        apartment?: {
            /**
             * the type of appartment
             */
            subType: 'house' | 'privateRoom' | 'sharedRoom'
            /**
             * the size of the appartment in qm
             * example: 120
             */
            size: number
            /**
             * number of bathrooms
             */
            bathrooms?: number
            /**
             * number of bedrooms
             */
            bedrooms?: number
            /**
             * total number of beds
             */
            beds?: number
            /**
             * max number of persons
             * example: 3
             */
            maxPersons?: number
            /**
             * wifi is available
             * example: true
             */
            wifi?: boolean
            /**
             * heating-system
             * example: true
             */
            heating?: boolean
            /**
             * TV
             * example: true
             */
            tv?: boolean
            /**
             * Bedrooms can be locked
             * example: true
             */
            lockableRooms?: boolean
            /**
             * equipment to iron
             * example: true
             */
            iron?: boolean
            /**
             * hairdryer
             * example: true
             */
            hairdryer?: boolean
            /**
             * existing washing machine
             * example: true
             */
            washingMachine?: boolean
            /**
             * existing dryer
             * example: true
             */
            dryer?: boolean
            /**
             * appartment contains a kitchen
             * example: true
             */
            kitchen?: boolean
            /**
             * optional breakfast
             * example: true
             */
            breakfast?: boolean
            /**
             * lift exists
             * example: true
             */
            lift?: boolean
            /**
             * pool included
             * example: true
             */
            pool?: boolean
            /**
             * fitness studio or room included
             * example: true
             */
            fitness?: boolean
            /**
             * parking available
             * example: true
             */
            freeParking?: boolean
            /**
             * whirlpool available
             * example: true
             */
            whirlpool?: boolean
            /**
             * airCondition available
             * example: true
             */
            airCondition?: boolean
            /**
             * are animals allowed
             */
            animals?: boolean
            /**
             * is smoking allowed
             */
            smoking?: boolean
            /**
             * are parties or events allowed
             */
            events?: boolean
            /**
             * comments on when and how to check-in
             */
            checkIn?: string
            /**
             * comments on when and how to check-out
             */
            checkOut?: string
            /**
             * the ambiente or enviroment
             */
            ambiente?: 'country' | 'innerCity' | 'nature'
        }
        /**
         * a bike or vehicle to rent.
         */
        bike?: {
            /**
             * the type of the bike
             */
            subType: 'road' | 'touring' | 'hybrid' | 'cross' | 'utility' | 'freight' | 'mountain' | 'racing' | 'motorized' | 'firefighter'
            /**
             * size of the bike
             */
            size: number
            /**
             * the brand
             */
            brand?: string
            /**
             * year when the bike was build
             */
            build?: number
            /**
             * number of riders
             * example: 1
             */
            riders?: number
            /**
             * number of gears
             * example: 20
             */
            gearing?: number
            /**
             * number of wheels
             * example: 2
             */
            wheels?: number
            /**
             * contains a seat for children
             * example: true
             */
            childSeat?: boolean
            /**
             * contains a tachometer or board computer
             */
            tacho?: boolean
            /**
             * the main material of the frame
             */
            material?: 'carbon' | 'luggedSteel' | 'bamboo' | 'plastic'
            /**
             * the design of the frame
             */
            frame?: 'portable' | 'safety' | 'smallWheel' | 'folding' | 'prone' | 'recumbent' | 'pennyFarthing'
            /**
             * the current condition of the bike
             */
            condition?: 'new' | 'used' | 'broken'
            /**
             * target group
             */
            target?: 'men' | 'women' | 'children'
        }
        /**
         * a washing machine
         */
        washingMachine?: {
            /**
             * the type of the machine
             */
            subType: 'industrial' | 'laundromat' | 'private'
            /**
             * the position for loading
             */
            loading?: 'heTopLoader' | 'topLoader' | 'frontLoader'
            /**
             * the brand
             */
            brand?: string
            /**
             * size of the bike
             */
            size: number
            /**
             * dryer included
             */
            dryer?: boolean
            /**
             * volume in L
             * example: 10
             */
            volume?: number
            /**
             * year when the washing machine was build
             */
            build?: number
            /**
             * the current condition of the bike
             */
            condition?: 'new' | 'used' | 'broken'
            /**
             * efficiency class
             */
            efficiency?: 'A+++' | 'A++' | 'A+' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
        }
        /**
         * a box, which can be locked and used to share anything
         */
        sharingBox?: {
            /**
             * the type of the box
             */
            subType: 'standalone' | 'grid'
            /**
             * width of the box
             */
            width?: number
            /**
             * height of the box
             */
            height?: number
            /**
             * depth of the box
             */
            depth?: number
            /**
             * year when the washing machine was build
             */
            build?: number
            /**
             * the current condition of the content
             */
            condition?: 'new' | 'used' | 'broken'
        }
    }
}
/* tslint:disable */
export const validationDef = {ContractFeatures:{description:'a object with features supported by the contract itself. This is readonly and should be used to figure out what kind of information or function can be called on the contract.',additionalProperties:false,properties:{singleOwner:{description:'all devices in this contract are owned by the same owner, which is the owner of the contract. Its base class is `SingleOwnerObjects`',type:'boolean',val:'0xff000002',example:true},multiOwner:{description:'each device in this contract has its own owner and can only be update by this owner. Its base class is `MultiOwnerObjects`',type:'boolean',val:'0xff000001',example:false},accessOnly:{description:'this contract supports no renting out of devices, but offers a lit of access-functions. Its base class is `AccessOnly`',type:'boolean',val:'0xff000003',example:false},accessWhiteList:{description:'offers function to extend the access to certain addresses. The interface `AccessSupport` is implemented.',type:'boolean',val:'0xd63efd09',example:false},grouped:{description:'supports the creation of multiple items of one device with the same metadata and settings. its base class is `SingleOwnerGroupedObjects`',type:'boolean',val:'0xd63efd21',example:false},stateChannel:{description:'supports statechannels. `StateChannelSupport` is implemented.',type:'boolean',val:'0x5fa3718b',example:true},timeRange:{description:'a minimum and maximum time to rent is validated. `TimeRangeSupport` is implemented.',type:'boolean',val:'0x51533fb7',example:true},multiTokens:{description:'supports exchanging between different tokens. `MultiTokenSupport` is implemented.',type:'boolean',val:'0xe1cae6fe',example:false},deposit:{description:'supports the storage of a deposit when renting. `DepositSupport` is implemented.',type:'boolean',val:'0xd8533f34',example:false},calendar:{description:'defines the times in a week when this device should be available. `WeekCalendarSupport` is implemented.',type:'boolean',val:'0xa7f26b04',example:false},dependingAccess:{description:'supports acces to devices which depend on others',type:'boolean',val:'0x83b8c330',example:false},blackList:{description:'allows to blacklist addresses. `BlackListSupport` is implemented.',type:'boolean',val:'0xa3fb4905',example:false},identity:{description:'allows only users, which are identifieable (keybe, post ident,...) to use this device. `IdentitySupport` is implemented.',type:'boolean',val:'0xf9378cb2',example:false},offChain:{description:'offers function to evaluate the state which is processed offchain. `OffChainSupport` is implemented.',type:'boolean',val:'0x3d8a1e6b',example:true},multisig:{description:'supports multisigs when calling canAccess. `MultisigSupport` is implemented.',type:'boolean',val:'0x7a26de3a'},verifiedDevice:{description:'supports public address in order to recover a signature from messages from the device.',type:'boolean',val:'0xa3951baf',example:true},rentFor:{description:'supports retning for a differetn time and a different user, which enables 100% privacy',type:'boolean',val:'0xbf89d2ac',example:true},discount:{description:'enables discount rules on prices',type:'boolean',val:'0xbe4adbf9',example:true},remoteFeature:{description:'enables Features, which are not directly implemented inside the contracts, but in a remote contract',type:'boolean',val:'0xaf568c9b',example:true},owner:{description:'defines a owner per device',type:'boolean',val:'0xb4762fab',example:true},meta:{description:'defines metadata for the device',type:'boolean',val:'0xfb4ca7b3',example:true},access:{description:'control the access for a device.',type:'boolean',val:'0xd1559fbc',example:true},renting:{description:'defines a contract able to rent and return.',type:'boolean',val:'0xb2a80dea',example:true}}},DeviceProperties:{description:'list of options per device',additionalProperties:false,properties:{rentable:{description:'marks a object as rentable',type:'boolean',val:0,example:true},stateChannel:{description:'allows users to use statechannels',type:'boolean',val:1,example:true},contractExec:{description:'allows users to send transaction directly to the contract.',type:'boolean',val:2,example:true},refund:{description:'allows users to use the rent-function with noRefundd=false. This means the users will have a chance to get a backpay in case he returns the device earlier.',type:'boolean',val:3,example:true},extendTime:{description:'if set the user can extend the renting time by calling rent again.',type:'boolean',val:4,example:true},identityRequired:{description:'if true and the Identity-feature is supported it will only allow identified person to rent the device.',type:'boolean',val:5,example:false},bookingOffChain:{description:'if true and the booking-feature is supported it will allow users to book a service off chain without a garantee.',type:'boolean',val:6,example:false},bookingOnChain:{description:'if true and the booking-feature is supported it will allow users to book a service on chain with a garantee',type:'boolean',val:7,example:true},acceptPending:{description:'if true devices may accept pending transaction and accept the risk of a double spend.',type:'boolean',val:8,example:false},searchable:{description:'device is listed within the search-service',type:'boolean',val:9,example:true}}},DeviceState:{description:'the available data for a device.',additionalProperties:false,type:'object',required:['url'],properties:{url:{description:'url',type:'string',format:'usnUrl',example:'bike@mycompany'},deviceId:{description:'the 32byte-deviceid of the device.',type:'string',format:'bytes32',example:'0x430ed88a4522388b82ce9b1f3cd8041d269bb6bd9922a61a0000000000000000'},contract:{description:'the address of the contract',type:'string',format:'address',example:'0x6e4BE57f78c4FC8BAF7bE71df143ed5D0A56668A'},token:{description:'the token for the price',type:'string',format:'address',example:'0x0000000000000000000000000000000000000000'},meta:{description:'The Metadata for the all devices.',type:'object',additionalProperties:false,required:['url','lang','location','price','device'],properties:{url:{description:'the human readable url for the given device',type:'string',format:'usnUrl',example:'appartment@simon-house-mittweida'},lang:{description:'iso-language as key',minproperties:1,additionalProperties:{exampleKey:'en',type:'object',properties:{name:{description:'the name or title of the device',type:'string',minLength:3,example:'my Appartment in the city'},description:{description:'a longer description which also allows the owner to use markdown',type:'string'},rules:{description:'rules and conditions layed out by the owner',type:'string'}},required:['name']},type:'object'},device:{description:'description of the type and its services',type:'object',required:['name','services'],properties:{name:{type:'string',description:'the devicetype',example:'lock'},services:{type:'array',description:'supported actions',example:['lock','unlock'],items:{type:'string'}}}},location:{description:'the location of the device',type:'object',additionalProperties:false,properties:{lng:{description:'longtitude',type:'number',minimum:-360,maximum:360,example:50.9855193},lat:{description:'latitude',type:'number',minimum:-90,maximum:90,example:12.9802203},country:{description:'country-code as defined in ISO 3166-1',type:'string',pattern:'[a-z0-9]{3}'},street:{description:'the street including the housenumber',type:'string'},city:{description:'city of the device',type:'string'},zipcode:{description:'zipcode or postalcode',type:'string'}},required:['lng','lat']},images:{description:'a list of images',type:'array',uniqueItems:true,items:{type:'object',additionalProperties:false,properties:{data:{example:'ipfs://QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t',description:'the data-url.\nThis url may contain base64-encoded images or support any of these protocls:\n - http://\n - https://\n - data:mime;encoding,\n - ipfs://\n - ipns://\n - swarm://\n',type:'string'},name:{description:'the title or name of a image',type:'string'}}}},price:{description:'pricedefinition',additionalProperties:false,type:'object',properties:{timeunit:{description:'timeunit to show in seconds (3600 = 1 hour)',type:'integer',minimum:1,example:3600}},required:['timeunit']},types:{description:'defines categories and their metadata. This can be used to find out the type of the Device.',type:'object',additionalProperties:false,properties:{apartment:{description:'a apartment or room locked up with a doorlock.',type:'object',additionalProperties:false,properties:{subType:{group:'main',description:'the type of appartment',type:'string',enum:['house','privateRoom','sharedRoom']},size:{group:'size',description:'the size of the appartment in qm',type:'number',minimum:1,example:120},bathrooms:{group:'size',description:'number of bathrooms',type:'integer'},bedrooms:{group:'size',description:'number of bedrooms',type:'integer'},beds:{group:'size',description:'total number of beds',type:'integer'},maxPersons:{group:'size',description:'max number of persons',type:'integer',minimum:1,example:3},wifi:{group:'features',description:'wifi is available',type:'boolean',example:true},heating:{group:'features',description:'heating-system',type:'boolean',example:true},tv:{group:'features',description:'TV',type:'boolean',example:true},lockableRooms:{group:'features',description:'Bedrooms can be locked',type:'boolean',example:true},iron:{group:'features',description:'equipment to iron',type:'boolean',example:true},hairdryer:{group:'features',description:'hairdryer',type:'boolean',example:true},washingMachine:{group:'features',description:'existing washing machine',type:'boolean',example:true},dryer:{group:'features',description:'existing dryer',type:'boolean',example:true},kitchen:{group:'features',description:'appartment contains a kitchen',type:'boolean',example:true},breakfast:{group:'features',description:'optional breakfast',type:'boolean',example:true},lift:{group:'features',description:'lift exists',type:'boolean',example:true},pool:{group:'features',description:'pool included',type:'boolean',example:true},fitness:{group:'features',description:'fitness studio or room included',type:'boolean',example:true},freeParking:{group:'features',description:'parking available',type:'boolean',example:true},whirlpool:{group:'features',description:'whirlpool available',type:'boolean',example:true},airCondition:{group:'features',description:'airCondition available',type:'boolean',example:true},animals:{group:'rules',description:'are animals allowed',type:'boolean',example:false},smoking:{group:'rules',description:'is smoking allowed',type:'boolean',example:false},events:{group:'rules',description:'are parties or events allowed',type:'boolean',example:false},checkIn:{group:'rules',description:'comments on when and how to check-in',type:'string'},checkOut:{group:'rules',description:'comments on when and how to check-out',type:'string'},ambiente:{group:'main',enum:['country','innerCity','nature'],description:'the ambiente or enviroment',type:'string'}},required:['subType','size']},bike:{description:'a bike or vehicle to rent.',type:'object',additionalProperties:false,properties:{subType:{group:'main',description:'the type of the bike',type:'string',enum:['road','touring','hybrid','cross','utility','freight','mountain','racing','motorized','firefighter']},size:{group:'size',description:'size of the bike',type:'number'},brand:{group:'main',description:'the brand',type:'string'},build:{group:'size',description:'year when the bike was build',type:'number'},riders:{group:'size',description:'number of riders',type:'number',minimum:1,example:1},gearing:{group:'size',description:'number of gears',type:'number',minimum:0,example:20},wheels:{group:'size',description:'number of wheels',type:'number',minimum:1,example:2},childSeat:{group:'features',description:'contains a seat for children',type:'boolean',example:true},tacho:{group:'features',description:'contains a tachometer or board computer',type:'boolean',example:false},material:{group:'main',description:'the main material of the frame',type:'string',enum:['carbon','luggedSteel','bamboo','plastic']},frame:{group:'main',description:'the design of the frame',type:'string',enum:['portable','safety','smallWheel','folding','prone','recumbent','pennyFarthing']},condition:{group:'size',description:'the current condition of the bike',type:'string',enum:['new','used','broken']},target:{group:'size',description:'target group',type:'string',enum:['men','women','children']}},required:['subType','size']},washingMachine:{description:'a washing machine',type:'object',additionalProperties:false,properties:{subType:{group:'main',description:'the type of the machine',type:'string',enum:['industrial','laundromat','private']},loading:{group:'main',description:'the position for loading',type:'string',enum:['heTopLoader','topLoader','frontLoader']},brand:{group:'main',description:'the brand',type:'string'},size:{group:'size',description:'size of the bike',type:'number'},dryer:{group:'features',description:'dryer included',type:'boolean',example:false},volume:{group:'size',description:'volume in L',type:'number',example:10},build:{group:'size',description:'year when the washing machine was build',type:'number'},condition:{group:'size',description:'the current condition of the bike',type:'string',enum:['new','used','broken']},efficiency:{group:'size',description:'efficiency class',type:'string',enum:['A+++','A++','A+','A','B','C','D','E','F','G']}},required:['subType','size']},sharingBox:{description:'a box, which can be locked and used to share anything',type:'object',additionalProperties:false,properties:{subType:{group:'main',description:'the type of the box',type:'string',enum:['standalone','grid']},width:{group:'size',description:'width of the box',type:'number'},height:{group:'size',description:'height of the box',type:'number'},depth:{group:'size',description:'depth of the box',type:'number'},build:{group:'size',description:'year when the washing machine was build',type:'number'},condition:{group:'size',description:'the current condition of the content',type:'string',enum:['new','used','broken']}},required:['subType']}}}}},devicePubKey:{description:'if a devicePubKey is available, it can be used to validate',type:'string',format:'bytes32'},pricePerHour:{description:'the price per hour',type:'number',minimum:0,example:10},bookings:{description:'list of all current bookings including the current renting',type:'array',items:{type:'object',properties:{rentedFrom:{type:'number',description:'start time'},rentedUntil:{type:'number',description:'end time'},controller:{type:'string',format:'address',description:'adress of the user controlling the device.'},paid:{type:'number',description:'price paid by the user'}}}},neededDeposit:{description:'deposit needed in order to rent it',type:'number',minimum:0,example:0},storedDeposit:{description:'deposit already stored by the user',type:'object',properties:{amount:{description:'the amount of tokens stored',type:'number',mininum:0},token:{description:'the token used whens storing',type:'string',format:'address'},access:{description:'the time the user would be able to claim the tokens back.',type:'number',minimum:0}}},metaHash:{description:'the url of the IPFS-Hash used to store the metadata',type:'string'},timeRange:{description:'the range of the time to rent',additionalProperties:false,type:'object',properties:{min:{description:'the minimal time in seconds',type:'number',minimum:0,example:3600},max:{description:'the maximal time in seconds',type:'number',minimum:0}}},count:{description:'the number of available devices (if grouped)',type:'number',minimum:0},owner:{description:'the owner of the device',type:'string',format:'address',example:'0x5338d77B5905CdEEa7c55a1F3A88d03559c36D73'},rentingState:{description:'the current renting state',type:'object',additionalProperties:false,properties:{rentable:{description:'if true the device can be rented',type:'boolean',example:true},open:{description:'if true the is open for the current time',type:'boolean',example:true},free:{description:'if true the device is not rented out currently',type:'boolean',example:false},controller:{description:'the current controller or 0x if not rented',type:'string',format:'address',example:'0x5338d77B5905CdEEa7c55a1F3A88d03559c36D73'},rentedUntil:{description:'the time until the controller can use it. the time is UNIX-stamp on seconds since 1970.',type:'number',timestamp:'renting',example:1503657750},rentedFrom:{description:'the time when the controller could start to use it. the time is UNIX-stamp on seconds since 1970.',type:'number',timestamp:'renting',example:1503657750},timestamp:{description:'the timestamp when this state was read from the device. this is a unix-timestamp in seconds.',type:'integer',timestamp:'current'},states:{type:'array',items:{type:'object',properties:{controller:{description:'the controller or null if not rented',type:'string',format:'address'},rentedUntil:{description:'the timestamp until the current device is rented. this is a unix-timestamp in seconds.',type:'integer',timestamp:'renting'},rentedFrom:{description:'the starting timestamp of the booking. this is a unix-timestamp in seconds.',type:'integer',timestamp:'renting'}}}},physicalState:{description:'the internal description of the device.',type:'object',properties:{internalId:{description:'internal id, which is mapped to the deviceId',type:'string'},state:{description:'current state of the device.',type:'string'},domain:{description:'domain or services offered by the device.',type:'object',properties:{name:{description:'internal name',type:'string'},services:{type:'array',description:'services offered by the device',items:{type:'string'}}}},lastUpdated:{description:'timestamp',type:'number'}},minProperties:3}}},supportedTokens:{description:'list of supported tokens',type:'array',items:{example:'0x0000000000000000000000000000000000000000',type:'string',format:'address'}},extra:{description:'extra-data stored for this device',type:'string',format:'hex'},properties:{description:'list of options per device',additionalProperties:false,properties:{rentable:{description:'marks a object as rentable',type:'boolean',val:0,example:true},stateChannel:{description:'allows users to use statechannels',type:'boolean',val:1,example:true},contractExec:{description:'allows users to send transaction directly to the contract.',type:'boolean',val:2,example:true},refund:{description:'allows users to use the rent-function with noRefundd=false. This means the users will have a chance to get a backpay in case he returns the device earlier.',type:'boolean',val:3,example:true},extendTime:{description:'if set the user can extend the renting time by calling rent again.',type:'boolean',val:4,example:true},identityRequired:{description:'if true and the Identity-feature is supported it will only allow identified person to rent the device.',type:'boolean',val:5,example:false},bookingOffChain:{description:'if true and the booking-feature is supported it will allow users to book a service off chain without a garantee.',type:'boolean',val:6,example:false},bookingOnChain:{description:'if true and the booking-feature is supported it will allow users to book a service on chain with a garantee',type:'boolean',val:7,example:true},acceptPending:{description:'if true devices may accept pending transaction and accept the risk of a double spend.',type:'boolean',val:8,example:false},searchable:{description:'device is listed within the search-service',type:'boolean',val:9,example:true}}},features:{description:'a object with features supported by the contract itself. This is readonly and should be used to figure out what kind of information or function can be called on the contract.',additionalProperties:false,properties:{singleOwner:{description:'all devices in this contract are owned by the same owner, which is the owner of the contract. Its base class is `SingleOwnerObjects`',type:'boolean',val:'0xff000002',example:true},multiOwner:{description:'each device in this contract has its own owner and can only be update by this owner. Its base class is `MultiOwnerObjects`',type:'boolean',val:'0xff000001',example:false},accessOnly:{description:'this contract supports no renting out of devices, but offers a lit of access-functions. Its base class is `AccessOnly`',type:'boolean',val:'0xff000003',example:false},accessWhiteList:{description:'offers function to extend the access to certain addresses. The interface `AccessSupport` is implemented.',type:'boolean',val:'0xd63efd09',example:false},grouped:{description:'supports the creation of multiple items of one device with the same metadata and settings. its base class is `SingleOwnerGroupedObjects`',type:'boolean',val:'0xd63efd21',example:false},stateChannel:{description:'supports statechannels. `StateChannelSupport` is implemented.',type:'boolean',val:'0x5fa3718b',example:true},timeRange:{description:'a minimum and maximum time to rent is validated. `TimeRangeSupport` is implemented.',type:'boolean',val:'0x51533fb7',example:true},multiTokens:{description:'supports exchanging between different tokens. `MultiTokenSupport` is implemented.',type:'boolean',val:'0xe1cae6fe',example:false},deposit:{description:'supports the storage of a deposit when renting. `DepositSupport` is implemented.',type:'boolean',val:'0xd8533f34',example:false},calendar:{description:'defines the times in a week when this device should be available. `WeekCalendarSupport` is implemented.',type:'boolean',val:'0xa7f26b04',example:false},dependingAccess:{description:'supports acces to devices which depend on others',type:'boolean',val:'0x83b8c330',example:false},blackList:{description:'allows to blacklist addresses. `BlackListSupport` is implemented.',type:'boolean',val:'0xa3fb4905',example:false},identity:{description:'allows only users, which are identifieable (keybe, post ident,...) to use this device. `IdentitySupport` is implemented.',type:'boolean',val:'0xf9378cb2',example:false},offChain:{description:'offers function to evaluate the state which is processed offchain. `OffChainSupport` is implemented.',type:'boolean',val:'0x3d8a1e6b',example:true},multisig:{description:'supports multisigs when calling canAccess. `MultisigSupport` is implemented.',type:'boolean',val:'0x7a26de3a'},verifiedDevice:{description:'supports public address in order to recover a signature from messages from the device.',type:'boolean',val:'0xa3951baf',example:true},rentFor:{description:'supports retning for a differetn time and a different user, which enables 100% privacy',type:'boolean',val:'0xbf89d2ac',example:true},discount:{description:'enables discount rules on prices',type:'boolean',val:'0xbe4adbf9',example:true},remoteFeature:{description:'enables Features, which are not directly implemented inside the contracts, but in a remote contract',type:'boolean',val:'0xaf568c9b',example:true},owner:{description:'defines a owner per device',type:'boolean',val:'0xb4762fab',example:true},meta:{description:'defines metadata for the device',type:'boolean',val:'0xfb4ca7b3',example:true},access:{description:'control the access for a device.',type:'boolean',val:'0xd1559fbc',example:true},renting:{description:'defines a contract able to rent and return.',type:'boolean',val:'0xb2a80dea',example:true}}}}},Metadata:{description:'The Metadata for the all devices.',type:'object',additionalProperties:false,required:['url','lang','location','price','device'],properties:{url:{description:'the human readable url for the given device',type:'string',format:'usnUrl',example:'appartment@simon-house-mittweida'},lang:{description:'iso-language as key',minproperties:1,additionalProperties:{exampleKey:'en',type:'object',properties:{name:{description:'the name or title of the device',type:'string',minLength:3,example:'my Appartment in the city'},description:{description:'a longer description which also allows the owner to use markdown',type:'string'},rules:{description:'rules and conditions layed out by the owner',type:'string'}},required:['name']},type:'object'},device:{description:'description of the type and its services',type:'object',required:['name','services'],properties:{name:{type:'string',description:'the devicetype',example:'lock'},services:{type:'array',description:'supported actions',example:['lock','unlock'],items:{type:'string'}}}},location:{description:'the location of the device',type:'object',additionalProperties:false,properties:{lng:{description:'longtitude',type:'number',minimum:-360,maximum:360,example:50.9855193},lat:{description:'latitude',type:'number',minimum:-90,maximum:90,example:12.9802203},country:{description:'country-code as defined in ISO 3166-1',type:'string',pattern:'[a-z0-9]{3}'},street:{description:'the street including the housenumber',type:'string'},city:{description:'city of the device',type:'string'},zipcode:{description:'zipcode or postalcode',type:'string'}},required:['lng','lat']},images:{description:'a list of images',type:'array',uniqueItems:true,items:{type:'object',additionalProperties:false,properties:{data:{example:'ipfs://QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t',description:'the data-url.\nThis url may contain base64-encoded images or support any of these protocls:\n - http://\n - https://\n - data:mime;encoding,\n - ipfs://\n - ipns://\n - swarm://\n',type:'string'},name:{description:'the title or name of a image',type:'string'}}}},price:{description:'pricedefinition',additionalProperties:false,type:'object',properties:{timeunit:{description:'timeunit to show in seconds (3600 = 1 hour)',type:'integer',minimum:1,example:3600}},required:['timeunit']},types:{description:'defines categories and their metadata. This can be used to find out the type of the Device.',type:'object',additionalProperties:false,properties:{apartment:{description:'a apartment or room locked up with a doorlock.',type:'object',additionalProperties:false,properties:{subType:{group:'main',description:'the type of appartment',type:'string',enum:['house','privateRoom','sharedRoom']},size:{group:'size',description:'the size of the appartment in qm',type:'number',minimum:1,example:120},bathrooms:{group:'size',description:'number of bathrooms',type:'integer'},bedrooms:{group:'size',description:'number of bedrooms',type:'integer'},beds:{group:'size',description:'total number of beds',type:'integer'},maxPersons:{group:'size',description:'max number of persons',type:'integer',minimum:1,example:3},wifi:{group:'features',description:'wifi is available',type:'boolean',example:true},heating:{group:'features',description:'heating-system',type:'boolean',example:true},tv:{group:'features',description:'TV',type:'boolean',example:true},lockableRooms:{group:'features',description:'Bedrooms can be locked',type:'boolean',example:true},iron:{group:'features',description:'equipment to iron',type:'boolean',example:true},hairdryer:{group:'features',description:'hairdryer',type:'boolean',example:true},washingMachine:{group:'features',description:'existing washing machine',type:'boolean',example:true},dryer:{group:'features',description:'existing dryer',type:'boolean',example:true},kitchen:{group:'features',description:'appartment contains a kitchen',type:'boolean',example:true},breakfast:{group:'features',description:'optional breakfast',type:'boolean',example:true},lift:{group:'features',description:'lift exists',type:'boolean',example:true},pool:{group:'features',description:'pool included',type:'boolean',example:true},fitness:{group:'features',description:'fitness studio or room included',type:'boolean',example:true},freeParking:{group:'features',description:'parking available',type:'boolean',example:true},whirlpool:{group:'features',description:'whirlpool available',type:'boolean',example:true},airCondition:{group:'features',description:'airCondition available',type:'boolean',example:true},animals:{group:'rules',description:'are animals allowed',type:'boolean',example:false},smoking:{group:'rules',description:'is smoking allowed',type:'boolean',example:false},events:{group:'rules',description:'are parties or events allowed',type:'boolean',example:false},checkIn:{group:'rules',description:'comments on when and how to check-in',type:'string'},checkOut:{group:'rules',description:'comments on when and how to check-out',type:'string'},ambiente:{group:'main',enum:['country','innerCity','nature'],description:'the ambiente or enviroment',type:'string'}},required:['subType','size']},bike:{description:'a bike or vehicle to rent.',type:'object',additionalProperties:false,properties:{subType:{group:'main',description:'the type of the bike',type:'string',enum:['road','touring','hybrid','cross','utility','freight','mountain','racing','motorized','firefighter']},size:{group:'size',description:'size of the bike',type:'number'},brand:{group:'main',description:'the brand',type:'string'},build:{group:'size',description:'year when the bike was build',type:'number'},riders:{group:'size',description:'number of riders',type:'number',minimum:1,example:1},gearing:{group:'size',description:'number of gears',type:'number',minimum:0,example:20},wheels:{group:'size',description:'number of wheels',type:'number',minimum:1,example:2},childSeat:{group:'features',description:'contains a seat for children',type:'boolean',example:true},tacho:{group:'features',description:'contains a tachometer or board computer',type:'boolean',example:false},material:{group:'main',description:'the main material of the frame',type:'string',enum:['carbon','luggedSteel','bamboo','plastic']},frame:{group:'main',description:'the design of the frame',type:'string',enum:['portable','safety','smallWheel','folding','prone','recumbent','pennyFarthing']},condition:{group:'size',description:'the current condition of the bike',type:'string',enum:['new','used','broken']},target:{group:'size',description:'target group',type:'string',enum:['men','women','children']}},required:['subType','size']},washingMachine:{description:'a washing machine',type:'object',additionalProperties:false,properties:{subType:{group:'main',description:'the type of the machine',type:'string',enum:['industrial','laundromat','private']},loading:{group:'main',description:'the position for loading',type:'string',enum:['heTopLoader','topLoader','frontLoader']},brand:{group:'main',description:'the brand',type:'string'},size:{group:'size',description:'size of the bike',type:'number'},dryer:{group:'features',description:'dryer included',type:'boolean',example:false},volume:{group:'size',description:'volume in L',type:'number',example:10},build:{group:'size',description:'year when the washing machine was build',type:'number'},condition:{group:'size',description:'the current condition of the bike',type:'string',enum:['new','used','broken']},efficiency:{group:'size',description:'efficiency class',type:'string',enum:['A+++','A++','A+','A','B','C','D','E','F','G']}},required:['subType','size']},sharingBox:{description:'a box, which can be locked and used to share anything',type:'object',additionalProperties:false,properties:{subType:{group:'main',description:'the type of the box',type:'string',enum:['standalone','grid']},width:{group:'size',description:'width of the box',type:'number'},height:{group:'size',description:'height of the box',type:'number'},depth:{group:'size',description:'depth of the box',type:'number'},build:{group:'size',description:'year when the washing machine was build',type:'number'},condition:{group:'size',description:'the current condition of the content',type:'string',enum:['new','used','broken']}},required:['subType']}}}}}}

/** validates the ContractFeatures and returns true | false. if it failes, use validateContractFeatures.errors to get a list of errors. */
export const validateContractFeatures = ajv.compile(validationDef.ContractFeatures)
export const ContractFeaturesDefinition = validationDef.ContractFeatures
export function validateContractFeaturesAndThrow (data:ContractFeatures) { validateAndThrow(validateContractFeatures,data) }
/** validates the DeviceProperties and returns true | false. if it failes, use validateDeviceProperties.errors to get a list of errors. */
export const validateDeviceProperties = ajv.compile(validationDef.DeviceProperties)
export const DevicePropertiesDefinition = validationDef.DeviceProperties
export function validateDevicePropertiesAndThrow (data:DeviceProperties) { validateAndThrow(validateDeviceProperties,data) }
/** validates the DeviceState and returns true | false. if it failes, use validateDeviceState.errors to get a list of errors. */
export const validateDeviceState = ajv.compile(validationDef.DeviceState)
export const DeviceStateDefinition = validationDef.DeviceState
export function validateDeviceStateAndThrow (data:DeviceState) { validateAndThrow(validateDeviceState,data) }
/** validates the Metadata and returns true | false. if it failes, use validateMetadata.errors to get a list of errors. */
export const validateMetadata = ajv.compile(validationDef.Metadata)
export const MetadataDefinition = validationDef.Metadata
export function validateMetadataAndThrow (data:Metadata) { validateAndThrow(validateMetadata,data) }