import { BN } from '../types/types.d'
import { DeviceProperties, validationDef } from '../types/meta'

/**
 * 
 */
const propBitIndex = Object.keys(validationDef.DeviceProperties.properties).reduce(
  (p, v) => ({ ...p, [v]: parseInt(validationDef.DeviceProperties.properties[v].val) }),
  {})

function getBits(hex: string) {
  if (!hex.startsWith('0x')) hex = '0x' + parseInt(hex).toString(16)
  let s = ''
  for (let i = 0; i < hex.length - 2; i += 1) {
    let v = parseInt(hex.charAt(i + 2), 16).toString(2)
    while (v.length < 4) v = '0' + v
    s += v
  }
  return s
}

function toHex(bits: boolean[]) {
  let s = ''
  for (let i = 0; i < bits.length; i += 4)
    s = ((bits[i] ? 1 : 0) + (bits[i + 1] ? 2 : 0) + (bits[i + 2] ? 4 : 0) + (bits[i + 3] ? 8 : 0)).toString(16) + s
  return '0x' + s
}

/**
 * returns a o ject with the supported properties from a bitmask.
 * @param props 
 */
export function toDeviceProperties(props: BN | string) {
  const bits = typeof props === 'string' ? getBits(props) : (<BN>props).toString(2)
  return Object.keys(propBitIndex)
    .reduce((p, v) => ({ ...p, [v]: bits.charAt(bits.length - 1 - propBitIndex[v]) === '1' }), {}) as DeviceProperties
}

/**
 * returns a value form a Object holding boolean values.
 * @param props 
 */
export function fromDeviceProperties(props: DeviceProperties) {
  const bits: boolean[] = []
  Object.keys(propBitIndex).forEach(name => bits[propBitIndex[name]] = props[name])
  return toHex(bits)
}
