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

import * as Ajv from 'ajv'
import { ABIDefinition } from '../types/types.d'
import utils = require('web3-utils')
import * as color from 'cli-color'

/**
 * Regex of a USN-URL
 */
export const URLRegex = /^([\w-]+)(#[0-9]+)?@([\w-\.]+)$/

/**
 * the ajv instance with custom formatters and keywords
 */
export const ajv = new Ajv()
ajv.addFormat('address', /^0x[0-9a-fA-F]{40}$/)
ajv.addFormat('bytes32', /^0x[0-9a-fA-F]{64}$/)
ajv.addFormat('hex', /^0x[0-9a-fA-F]{2,}$/)
ajv.addFormat('hexWithout', /^[0-9a-fA-F]{2,}$/)
ajv.addFormat('path', /^[\/a-zA-Z_\-0-9]+$/)
ajv.addFormat('usnUrl', URLRegex)

ajv.addKeyword('timestamp', {
  type: 'number',
  validate: (sch, data) => sch === 'current'
    ? !!(data > Date.now() / 1000 - 60 || data < Date.now() / 1000 + 60)
    : !!(data === 0 || Date.now() / 1000 - 3600 * 24 * 365 || data < Date.now() / 1000 + 3600 * 24 * 365)
})

/**
 * validates the data and throws an error in case they are not valid.
 * 
 * @export
 * @param {Ajv.ValidateFunction} fn 
 * @param {any} ob 
 */
export function validateAndThrow(fn: Ajv.ValidateFunction, ob) {
  if (!fn(ob))
    throw new Error('ERRKEY: invalid_data : ' + (fn).errors.map(_ =>
      _.dataPath + '(' + JSON.stringify(_.data || _.params) + '):' + _.message).join(', ') + ':' + JSON.stringify(ob, null, 2))
}

function isValidInteger(val: any, len: number, signed: boolean): boolean {
  switch (typeof val) {
    case 'object':
      return val.gte &&
        (!len || val.toString(16).length <= len / 4) &&
        (!signed || !val.isNeg())
    case 'number':
      return true && // *Number.isSafeInteger(val) && 
        // tslint:disable-next-line:no-bitwise
        (!len || len > 16 || Math.abs(val) < 1 << len) &&
        (!signed || val >= 0)
    case 'string':
      return utils.isHex(val) &&
        (!len || val.length <= 2 + len / 4)
    default:
      return false
  }
}

export function validateCallResult(result: any, def: ABIDefinition): any {
  //  if (def.outputs.length > 1) return result
  def.outputs.forEach((d, i) => {
    let val = def.outputs.length === 1 ? result : result[i]
    if (d.type.indexOf('bool') >= 0) {
      val = d.type.indexOf('[') >= 0
        ? val.map(v => typeof (v) === 'boolean' ? v : v.toString().endsWith('1'))
        : typeof val === 'boolean' ? val : val.toString().endsWith('1')
    }
    if (d.type.indexOf('int') >= 0) {
      val = d.type.indexOf('[') >= 0
        ? val.map(utils.toBN)
        : utils.toBN(val)
    }
    if (def.outputs.length === 1)
      result = val
    else
      result[d.name || 'key1'] = result[i] = val
  })
  return result
}

export function validateArguments(args: any, def: ABIDefinition) {
  const errPrefix = `Error calling ${def.name} with ${def.inputs.map((d, i) => d.name + ':' + JSON.stringify(args[i])).join()}`
  def.inputs.forEach((arg, i) => {
    const val = args[i]
    const name = arg.name || 'key' + (i + 1)
    const isArray = arg.type.indexOf('[') + 1
    const t = isArray ? arg.type.substr(0, isArray - 1) : arg.type
    if (Array.isArray(val) !== !!isArray) throw new Error(`${errPrefix} : ${name} must be an Array!`)
    const aVal: any[] = (isArray ? val : [val])
    aVal.forEach(v => {
      if (t === 'address') {
        if (!utils.isAddress(v)) throw new Error(`${errPrefix} : ${name} must be a valid address!`)
      }
      else if (t.startsWith('bytes')) {
        if (!isValidInteger(v, 8 * parseInt(t.substring(5)), false))
          throw new Error(`${errPrefix} : ${name} must be a valid ${t}!`)
      }
      else if (t.startsWith('uint')) {
        if (!isValidInteger(v, parseInt(t.substring(4)), false))
          throw new Error(`${errPrefix} : ${name} must be a valid ${t}!`)
      }
      else if (t.startsWith('int')) {
        if (!isValidInteger(v, parseInt(t.substring(3)), true))
          throw new Error(`${errPrefix} : ${name} must be a valid ${t}!`)
      }
      else if (t.startsWith('bool')) {
        if (typeof v !== 'boolean') throw new Error(`${errPrefix} : ${name} must be a valid ${t}!`)
      }
    })

  })
}

function formatEvent(ev) {
  if (Array.isArray(ev)) return ev.map((_, i) => '\n                                       ' + (i + 1) + ' : ' + formatEvent(_)).join('')
  return Object.keys(ev.returnValues).filter(_ => Number.isNaN(parseInt(_))).map(n => ' ' + n + '=' + ev.returnValues[n]).join()
}

export function formatEvents(events) {
  if (!events) return '--'
  return Object.keys(events).filter(_ => Number.isNaN(parseInt(_))).map(
    n => '\n                                 #' + color.yellow(n) + ' : ' + formatEvent(events[n])).join('')

}

export function toNumber(val): number {
  if (utils.isBN(val)) {
    try {
      return val.toNumber()
    }
    catch (x) {
      return parseInt(val.toString()) || 0
    }
  }
  return parseInt(val) || 0

}