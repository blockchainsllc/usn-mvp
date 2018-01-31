/**
 * Searches for devices
 */
import { ENS } from '../contracts'
import { toHex, toAdr, toBytes32, verifyValidAddress, verifyValidBytes32, NULLADR } from '../utils/eth'
import config from './config'
import web3 from './web3'
import { BlockType, EventLog } from '../types/types.d'
import Web3 from '../types/web3'
import { URLRegex } from '../utils/validate'

function getNodeId(name: string, root?: string) {
  return name.split('.').reduceRight(
    (r, n) => web3.utils.keccak256(r + web3.utils.keccak256(toHex(n)).substring(2)), toHex(root || '0x0', 32))
}

let rootNode: string = null
export async function getRootNode() {
  return rootNode || (rootNode = await ENS.USNResolver.at(config.contracts.registry).rootNode())
}

/**
 * 
 * parses a url, which can in any of these forms:
 * - <deviceName>.<contractName>
 * - <deviceName>.<contractName>.usn
 * - <deviceName>.<contractName>.usn.eth
 * - <deviceName>@<contractName>
 * - <deviceName>@<contractName>.usn
 * - <deviceName>@<contractName>.usn.eth
 * - <contractName>#<deviceName>
 * - <contractName>#<deviceName>.usn
 * - <contractName>#<deviceName>.usn.eth
 * - <contractName>@<deviceName>#<counter>
 * if the contractName starts with 0x the address is taken, otherwise the ENS will be used to resolve the name.
 * if the deviceName starts with 0x the identifier is taken as is, otherwise the sha256 is used to generate the deviceId out of the name.
 */
export async function resolveURL(url: string) {
  const n = parseURL(url)
  if (!n) throw new Error('ERRKEY: invalid_url : the url is not valid : ' + url)
  verifyValidBytes32({ node: n.nodeId, deviceId: n.deviceId })

  const contract = toAdr(await ENS.USNResolver.at(config.contracts.registry).addr(n.nodeId))
  if (!contract || contract === '0x0000000000000000000000000000000000000000')
    throw new Error('ERRKEY: name_not_registered: the ENS name ' + n.contractName + ' is not registered!')
  verifyValidAddress({ contract })
  return { ...n, url: n.deviceName + (n.counter ? '#' + n.counter : '') + '@' + n.contractName, contract }
}

function getDeviceIdFromName(name: string, id: string) {
  if (name.startsWith('0x'))
    return toBytes32(name)
  const hash = web3.utils.sha3(toHex(name)).substring(0, 50) + '0000000000000000'
  if (id) {
    if (!id.startsWith('0x')) id = '0x' + parseInt(id, 10).toString(16)
    if (id === '0xNaN') throw new Error('ERRKEY: wrong_counter : the counter must be a number ')
    if (id.length > 18) throw new Error('ERRKEY: the counter is too long ' + id)
    return hash.substring(0, 50) + toHex(id, 8).substring(2)
  }
  return hash
}

export function parseURL(url: string) {
  const result = url ? URLRegex.exec(url) : undefined
  return result ? {
    deviceName: result[1],
    contractName: result[3],
    counter: result[2] ? (parseInt(result[2].substr(1)) || 0) : 0,
    deviceId: result[1].startsWith('0x') ? toBytes32(result[1]) : getDeviceIdFromName(result[1], result[2] ? result[2].substr(1) : ''),
    nodeId: result[3].startsWith('0x') ? toBytes32(result[3]) : getNodeId(result[3])
  } : undefined
}

export function normalizeURL(url: string) {
  const result = url ? URLRegex.exec(url) : undefined
  if (!result) return undefined
  if (result[1].startsWith('0x')) throw new Error('ERRKEY: url_already_resolved : The url does not contain the deviceName! ' + url)
  if (result[3].startsWith('0x')) throw new Error('ERRKEY: url_already_resolved : The url does not contain the contractName! ' + url)
  const c = result[2] ? parseInt(result[2].substring(1)) : 0
  return `${result[1]}${c ? '#' + c : ''}@${result[3].replace(/\..*/, '')}`
}

export async function getOwner(name: string) {
  const reg = ENS.USNRegistrar.at(config.contracts.usnRegistrar)
  return ENS.AbstractENS.at(await reg.ens()).owner(getNodeId(name, await reg.rootNode()))
}

/**
 * 
 * @param prefix finds the next available name for a contract
 * @param startIndex 
 */
export async function findContractName(prefix?: string, startIndex = 0) {
  if (!prefix) prefix = web3.utils.toBN(Date.now() + '' + Math.round(Math.random() * 10000000)).toString(34)
  const target = await ENS.USNRegistrar.at(config.contracts.usnRegistrar).difficulty()
  function fits(name) {
    return web3.utils.toBN(web3.utils.sha3(toHex(name))).lt(target)
  }

  let i = ''
  while (!fits(prefix + i) || (await getOwner(prefix + i)) !== NULLADR) i = (parseInt(i || '0') + 1).toString()
  return prefix + i
}

export async function getLib(name: string) {
  return config.contracts[name] || ENS.USNResolver.at(config.contracts.registry).lib(web3.utils.sha3(name).substring(0, 10))
    .then(_ => config.contracts[name] = _)
}

export async function setLib(name: string, adr: string) {
  const resolver = ENS.USNResolver.at(config.contracts.registry)
  config.contracts[name] = adr
  await resolver.setLib(web3.utils.sha3(name).substring(0, 10), adr, { from: await resolver.owner() })
}

export async function getUSNRegistrar() {
  if (config.contracts.usnRegistrar) return config.contracts.usnRegistrar
  const resolver = ENS.USNResolver.at(config.contracts.registry)
  const ens = ENS.AbstractENS.at(await resolver.ens())
  const usnRegistrar = await ens.owner(await resolver.rootNode())
  return config.contracts.usnRegistrar = usnRegistrar
}