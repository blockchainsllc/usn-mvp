import {ajv, validateAndThrow} from '../utils/validate'
import * as Ajv from 'ajv'
/**
 * Message demanding DEVICE PHYSICAL STATE change.
 */
export interface ActionMessage {
    msgId?: number
    /**
     * marks the message as action message
     */
    msgType: 'action'
    /**
     * the human readable url of the device
     * example: bike@myCompany
     */
    url: string // usnUrl
    /**
     * Unix format timestamp (in seconds) of the message. Used to avoid using same message twice.
     */
    timestamp: number
    /**
     * Abstract physical action. I.E. open, lock, detonate.
     */
    action: string
    /**
     * Object containing data that the physical device expects to trigger change of state.
     */
    metadata?: {
    }
    signature: Signature
    /**
     * States that this message was handled by stateMgr.
     */
    handled?: boolean
    /**
     * States that this message was verified by a verifier module.
     */
    verified?: boolean
}
/**
 * Message send back in case of an error
 */
export interface ErrorResponse {
    /**
     * a unique id to identifiy the message
     */
    msgId?: number
    /**
     * fixed type
     */
    msgType: 'error'
    /**
     * the human readable url of the device
     * example: bike@myCompany
     */
    url: string // usnUrl
    /**
     * the timestamp when this state was read from the device. this is a unix-timestamp in seconds.
     */
    timestamp: number
    /**
     * the error-message
     */
    error: string
    /**
     * the key used to translate the message
     */
    errkey?: string
    /**
     * the arguments
     */
    args?: string[]
    /**
     * the signature of the device itself in order to prove that these data are correct.
     */
    signature?: Signature
}
/**
 * Requests a read message from the device. The signature is optional and it is used to authenticate the requestor of the information, in order to return more details.
 */
export interface ReadStateMessageRequest {
    msgId?: number
    /**
     * marks the message as read message
     */
    msgType: 'read'
    /**
     * the timestamp when this state was read from the device. this is a unix-timestamp in seconds.
     */
    timestamp: number
    /**
     * the human readable url of the device
     * example: bike@myCompany
     */
    url: string // usnUrl
    /**
     * Signature based on the above values. If signed and user has access to the device, the response may include additional values, like the location.
     */
    signature?: Signature
}
/**
 * Message from the device with its current state, signed by the device in order to prove its authenticity
 */
export interface ReadStateMessageResponse {
    /**
     * a unique id to identifiy the message
     */
    msgId?: number
    /**
     * fixed type
     */
    msgType: 'readResponse'
    /**
     * the human readable url of the device
     * example: bike@myCompany
     */
    url: string // usnUrl
    /**
     * the timestamp when this state was read from the device. this is a unix-timestamp in seconds.
     */
    timestamp: number
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
    /**
     * the signature of the device itself in order to prove that these data are correct.
     */
    signature?: Signature
}
/**
 * Verified ECDSA Signature.
 * Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.
 * For more visit [ECDSA Q&A]{@link https://bitcoin.stackexchange.com/questions/38351/ecdsa-v-r-s-what-is-v}
 * 
 */
export interface Signature {
    /**
     * the message
     */
    message?: string
    /**
     * hash of the message
     */
    messageHash: string // bytes32
    /**
     * Positive non-zero Integer signature.r
     */
    r: string // hex
    /**
     * Positive non-zero Integer signature.s
     */
    s: string // hex
    /**
     * Calculated curve point, or identity element O.
     */
    v: string // hex
    /**
     * the concated signature of r+s+v
     */
    signature?: string // hex
}
/**
 * Message demanding DEVICE RENTAL STATE change.
 */
export interface StateMessage {
    /**
     * the device identifier
     * example: bike@myCompany
     */
    url: string // usnUrl
    /**
     * Limit date of rental. After this date the stateMgr must set the device free for rent. 
     * The value is a unix-timestamp in seconds since 1970.
     * 
     */
    rentedUntil: number
    /**
     * start of the rental, if not provided the default will be the current timestamp.
     * The value is a unix-timestamp in seconds since 1970.
     * 
     */
    rentedFrom?: number
    /**
     * address of the contract controller
     */
    controller?: string // address
    /**
     * Message verification-data
     */
    verification?: {
        /**
         * Name of the module that handles the verification
         */
        paymentType: 'fiat' | 'eth' | 'btc' | 'stateChannel'
        /**
         * Additional data object required for verification, depending on the paymentType
         */
        data?: {
            [name: string]: {
            } | number | string | boolean
        }
    }
    /**
     * Message source. Demand specific action.
     */
    msgType: 'rent' | 'return'
    /**
     * States that this message was handled by stateMgr.
     */
    handled?: boolean
    /**
     * States that this message was verified by a verifier module.
     */
    verified?: boolean
}
/* tslint:disable */
export const validationDef = {Signature:{type:'object',description:'Verified ECDSA Signature.\nSignatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.\nFor more visit [ECDSA Q&A]{@link https://bitcoin.stackexchange.com/questions/38351/ecdsa-v-r-s-what-is-v}\n',properties:{message:{type:'string',description:'the message'},messageHash:{type:'string',description:'hash of the message',format:'bytes32'},r:{type:'string',description:'Positive non-zero Integer signature.r',format:'hex'},s:{type:'string',description:'Positive non-zero Integer signature.s',format:'hex'},v:{type:'string',description:'Calculated curve point, or identity element O.',format:'hex'},signature:{type:'string',description:'the concated signature of r+s+v',format:'hex'}},required:['messageHash','r','s','v']},StateMessage:{description:'Message demanding DEVICE RENTAL STATE change.',type:'object',required:['url','rentedUntil','msgType'],additionalProperties:false,properties:{url:{description:'the device identifier',type:'string',format:'usnUrl',example:'bike@myCompany'},rentedUntil:{type:'integer',description:'Limit date of rental. After this date the stateMgr must set the device free for rent. \nThe value is a unix-timestamp in seconds since 1970.\n',timestamp:'renting'},rentedFrom:{type:'integer',description:'start of the rental, if not provided the default will be the current timestamp.\nThe value is a unix-timestamp in seconds since 1970.\n',timestamp:'renting'},controller:{type:'string',description:'address of the contract controller',format:'address'},verification:{description:'Message verification-data',type:'object',properties:{paymentType:{type:'string',description:'Name of the module that handles the verification',enum:['fiat','eth','btc','stateChannel']},data:{type:'object',description:'Additional data object required for verification, depending on the paymentType',additionalProperties:{type:['object','number','string','boolean']}}},required:['paymentType']},msgType:{enum:['rent','return'],type:'string',description:'Message source. Demand specific action.'},handled:{type:'boolean',description:'States that this message was handled by stateMgr.'},verified:{type:'boolean',description:'States that this message was verified by a verifier module.'}}},ActionMessage:{description:'Message demanding DEVICE PHYSICAL STATE change.',type:'object',additionalProperties:false,required:['url','msgType','timestamp','action','signature'],properties:{msgId:{descripton:'a unique id to identifiy the message',type:'number'},msgType:{enum:['action'],type:'string',description:'marks the message as action message'},url:{description:'the human readable url of the device',type:'string',format:'usnUrl',example:'bike@myCompany'},timestamp:{type:'integer',description:'Unix format timestamp (in seconds) of the message. Used to avoid using same message twice.',timestamp:'current'},action:{type:'string',description:'Abstract physical action. I.E. open, lock, detonate.'},metadata:{type:'object',description:'Object containing data that the physical device expects to trigger change of state.'},signature:{type:'object',description:'Verified ECDSA Signature.\nSignatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.\nFor more visit [ECDSA Q&A]{@link https://bitcoin.stackexchange.com/questions/38351/ecdsa-v-r-s-what-is-v}\n',properties:{message:{type:'string',description:'the message'},messageHash:{type:'string',description:'hash of the message',format:'bytes32'},r:{type:'string',description:'Positive non-zero Integer signature.r',format:'hex'},s:{type:'string',description:'Positive non-zero Integer signature.s',format:'hex'},v:{type:'string',description:'Calculated curve point, or identity element O.',format:'hex'},signature:{type:'string',description:'the concated signature of r+s+v',format:'hex'}},required:['messageHash','r','s','v']},handled:{type:'boolean',description:'States that this message was handled by stateMgr.'},verified:{type:'boolean',description:'States that this message was verified by a verifier module.'}}},ErrorResponse:{description:'Message send back in case of an error',type:'object',required:['url','error','timestamp','msgType'],properties:{msgId:{description:'a unique id to identifiy the message',type:'number'},msgType:{description:'fixed type',type:'string',enum:['error']},url:{description:'the human readable url of the device',type:'string',format:'usnUrl',example:'bike@myCompany'},timestamp:{description:'the timestamp when this state was read from the device. this is a unix-timestamp in seconds.',type:'integer',timestamp:'current'},error:{description:'the error-message',type:'string'},errkey:{description:'the key used to translate the message',type:'string'},args:{description:'the arguments',type:'array',items:{type:'string'}},signature:{description:'Verified ECDSA Signature.\nSignatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.\nFor more visit [ECDSA Q&A]{@link https://bitcoin.stackexchange.com/questions/38351/ecdsa-v-r-s-what-is-v}\n',type:'object',properties:{message:{type:'string',description:'the message'},messageHash:{type:'string',description:'hash of the message',format:'bytes32'},r:{type:'string',description:'Positive non-zero Integer signature.r',format:'hex'},s:{type:'string',description:'Positive non-zero Integer signature.s',format:'hex'},v:{type:'string',description:'Calculated curve point, or identity element O.',format:'hex'},signature:{type:'string',description:'the concated signature of r+s+v',format:'hex'}},required:['messageHash','r','s','v']}}},ReadStateMessageResponse:{description:'Message from the device with its current state, signed by the device in order to prove its authenticity',type:'object',required:['url','rentedUntil','timestamp','msgType'],properties:{msgId:{description:'a unique id to identifiy the message',type:'number'},msgType:{description:'fixed type',type:'string',enum:['readResponse']},url:{description:'the human readable url of the device',type:'string',format:'usnUrl',example:'bike@myCompany'},timestamp:{description:'the timestamp when this state was read from the device. this is a unix-timestamp in seconds.',type:'integer',timestamp:'current'},states:{type:'array',items:{type:'object',properties:{controller:{description:'the controller or null if not rented',type:'string',format:'address'},rentedUntil:{description:'the timestamp until the current device is rented. this is a unix-timestamp in seconds.',type:'integer',timestamp:'renting'},rentedFrom:{description:'the starting timestamp of the booking. this is a unix-timestamp in seconds.',type:'integer',timestamp:'renting'}}}},physicalState:{description:'the internal description of the device.',type:'object',properties:{internalId:{description:'internal id, which is mapped to the deviceId',type:'string'},state:{description:'current state of the device.',type:'string'},domain:{description:'domain or services offered by the device.',type:'object',properties:{name:{description:'internal name',type:'string'},services:{type:'array',description:'services offered by the device',items:{type:'string'}}}},lastUpdated:{description:'timestamp',type:'number'}},minProperties:3},signature:{description:'Verified ECDSA Signature.\nSignatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.\nFor more visit [ECDSA Q&A]{@link https://bitcoin.stackexchange.com/questions/38351/ecdsa-v-r-s-what-is-v}\n',type:'object',properties:{message:{type:'string',description:'the message'},messageHash:{type:'string',description:'hash of the message',format:'bytes32'},r:{type:'string',description:'Positive non-zero Integer signature.r',format:'hex'},s:{type:'string',description:'Positive non-zero Integer signature.s',format:'hex'},v:{type:'string',description:'Calculated curve point, or identity element O.',format:'hex'},signature:{type:'string',description:'the concated signature of r+s+v',format:'hex'}},required:['messageHash','r','s','v']}},minProperties:7},ReadStateMessageRequest:{description:'Requests a read message from the device. The signature is optional and it is used to authenticate the requestor of the information, in order to return more details.',type:'object',required:['url','msgType','timestamp'],properties:{msgId:{descripton:'a unique id to identifiy the message',type:'number'},msgType:{enum:['read'],type:'string',description:'marks the message as read message'},timestamp:{description:'the timestamp when this state was read from the device. this is a unix-timestamp in seconds.',type:'integer',timestamp:'current'},url:{description:'the human readable url of the device',type:'string',format:'usnUrl',example:'bike@myCompany'},signature:{description:'Verified ECDSA Signature.\nSignatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.\nFor more visit [ECDSA Q&A]{@link https://bitcoin.stackexchange.com/questions/38351/ecdsa-v-r-s-what-is-v}\n',type:'object',properties:{message:{type:'string',description:'the message'},messageHash:{type:'string',description:'hash of the message',format:'bytes32'},r:{type:'string',description:'Positive non-zero Integer signature.r',format:'hex'},s:{type:'string',description:'Positive non-zero Integer signature.s',format:'hex'},v:{type:'string',description:'Calculated curve point, or identity element O.',format:'hex'},signature:{type:'string',description:'the concated signature of r+s+v',format:'hex'}},required:['messageHash','r','s','v']}}}}

/** validates the Signature and returns true | false. if it failes, use validateSignature.errors to get a list of errors. */
export const validateSignature = ajv.compile(validationDef.Signature)
export const SignatureDefinition = validationDef.Signature
export function validateSignatureAndThrow (data:Signature) { validateAndThrow(validateSignature,data) }
/** validates the StateMessage and returns true | false. if it failes, use validateStateMessage.errors to get a list of errors. */
export const validateStateMessage = ajv.compile(validationDef.StateMessage)
export const StateMessageDefinition = validationDef.StateMessage
export function validateStateMessageAndThrow (data:StateMessage) { validateAndThrow(validateStateMessage,data) }
/** validates the ActionMessage and returns true | false. if it failes, use validateActionMessage.errors to get a list of errors. */
export const validateActionMessage = ajv.compile(validationDef.ActionMessage)
export const ActionMessageDefinition = validationDef.ActionMessage
export function validateActionMessageAndThrow (data:ActionMessage) { validateAndThrow(validateActionMessage,data) }
/** validates the ErrorResponse and returns true | false. if it failes, use validateErrorResponse.errors to get a list of errors. */
export const validateErrorResponse = ajv.compile(validationDef.ErrorResponse)
export const ErrorResponseDefinition = validationDef.ErrorResponse
export function validateErrorResponseAndThrow (data:ErrorResponse) { validateAndThrow(validateErrorResponse,data) }
/** validates the ReadStateMessageResponse and returns true | false. if it failes, use validateReadStateMessageResponse.errors to get a list of errors. */
export const validateReadStateMessageResponse = ajv.compile(validationDef.ReadStateMessageResponse)
export const ReadStateMessageResponseDefinition = validationDef.ReadStateMessageResponse
export function validateReadStateMessageResponseAndThrow (data:ReadStateMessageResponse) { validateAndThrow(validateReadStateMessageResponse,data) }
/** validates the ReadStateMessageRequest and returns true | false. if it failes, use validateReadStateMessageRequest.errors to get a list of errors. */
export const validateReadStateMessageRequest = ajv.compile(validationDef.ReadStateMessageRequest)
export const ReadStateMessageRequestDefinition = validationDef.ReadStateMessageRequest
export function validateReadStateMessageRequestAndThrow (data:ReadStateMessageRequest) { validateAndThrow(validateReadStateMessageRequest,data) }
// --end-generated--

export function getDataToSignFromActionMessage(message: ActionMessage): string {
    return message.url + message.timestamp + message.action + JSON.stringify(message.metadata)
}

export function getDataToSignFromErrorResponse(message: ErrorResponse): string {
    return message.url + message.msgId + message.timestamp + message.error + message.errkey + JSON.stringify(message.args)
}

export function getDataToSignFromReadStateMessageResponse(message: ReadStateMessageResponse): string {
    return message.url + message.timestamp
} 