//
// This file is part of usn-lib.
// 
// It is subject to the terms and conditions defined in
// file 'LICENSE.', which is part of this source code package.
//
// @author Simon Jentzsch 
// @version 0.9
// @copyright 2017 by Slock.it GmbH
//

import * as util from './copy'
import { ABIDefinition, BN } from '../types/types.d'
import web3 from '../services/web3'

/**
 * address for value 0
 */
export const NULLADR = '0x0000000000000000000000000000000000000000'

/**
 * checks if the address has a non value
 * 
 * @export
 * @param {string} address 
 * @returns {boolean} 
 */
export function isZeroAddress(address: string): boolean {
    return !address || address === NULLADR || !parseInt(address, 16)
}

/**
 * checks if the address is valid
 * 
 * @export
 * @param {string} address 
 * @returns {boolean} 
 */
export function isValidAddress(address: string): boolean {
    return address && regAddress.test(address)
}
const regAddress = /^0x[a-f0-9]{40}$/

/**
 * verifies addresses.
 * 
 * @export
 * @param {{ [name: string]: string }} addresses 
 */
export function verifyValidAddress(addresses: { [name: string]: string }) {
    const invalid = Object.keys(addresses).filter(_ => !isValidAddress(addresses[_]))
    if (invalid.length)
        throw new Error('ERRKEY: invalid_address: ' + invalid.map(_ => _ + ' (' + addresses[_] + ')').join(', ') +
            ' are no valid addresses! They must match ' + regAddress)
}
const regBytes32 = /^0x[a-f0-9]{64}$/
export function isValidBytes32(address: string): boolean {
    return address && regBytes32.test(address)
}

export function verifyValidBytes32(addresses: { [name: string]: string }) {
    const invalid = Object.keys(addresses).filter(_ => !isValidBytes32(addresses[_]))
    if (invalid.length)
        throw new Error('ERRKEY: invalid_id: ' + invalid.map(_ => _ + ' (' + addresses[_] + ')').join(', ') +
            ' are no valid addresses! They must match ' + regAddress)
}

/**
 * 
 * returns the counter for deviceId
 * 
 * @export
 * @param {string} deviceId 
 * @returns 
 */
export function getCounter(deviceId: string) {
    return parseInt(toBytes32(deviceId).substring(50), 16)
}

export function getNameHash(deviceId: string) {
    return toBytes32(deviceId).substring(0, 50)
}

export function toHexLen(val: string, len: number = 42) {
    if (val.startsWith('0x')) {
        if (val.length === len) return val
        val = val.substring(2)
    }
    while (val.length < len - 2) val = '0' + val
    return '0x' + val
}

export function toAdr(val: any) {
    return toHex(val, 20).toLowerCase()
}
export function toBytes32(val: any) {
    return toHex(val, 32).toLowerCase()
}

export function toHex(val: any, len: number = 0) {
    if (typeof (val) === 'string') {
        if (val.startsWith('0x')) return len ? toHexLen(val, len * 2 + 2) : val
        val = Buffer.from(val, 'utf-8').toString('hex')
        return len ? toHexLen('0x' + val, len * 2 + 2) : '0x' + val
    }
    if (typeof (val) === 'number') {
        let hex = Math.round(val).toString(16)
        if (hex.length % 2) hex = '0' + hex
        return len ? toHexLen('0x' + hex, len * 2 + 2) : '0x' + hex
    }

    throw new Error('Unsupported value to convert to hex')
}

let fnHex: { [hex: string]: string } = null
export function replaceFnHex(data: any) {
    if (!data) return data
    if (typeof data === 'object')
        data = JSON.stringify(data)

    if (!fnHex) {
        fnHex = {}
        const contracts = require('../contracts')
        Object.keys(contracts).forEach(ns => {
            Object.keys(contracts[ns]).map(_ => contracts[ns][_]).forEach(c => {
                c.abi.filter(_ => _.type === 'function').forEach((fn: ABIDefinition) => {
                    fnHex[web3.eth.abi.encodeFunctionSignature(fn)] = fn.name
                })
            })
        })
    }
    return data.replace(/(0x[0-9a-fA-F]+)/gm, (a, d, pos) => {
        const name = fnHex[d.substr(0, 10)] || fnHex[d]
        return name ? '&lt;' + name + '&gt;' + d.substr(10) : d
    })
}
