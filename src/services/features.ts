
/**
 * Searches for devices
 */
import * as contracts from '../contracts'
import { toHex, toAdr, toBytes32, verifyValidAddress, verifyValidBytes32 } from '../utils/eth'
import * as registry from './registry'
import { ContractFeatures, validationDef } from '../types/meta'
import Web3 from '../types/web3'
import web3 from './web3'

// tslint:disable-next-line:no-object-literal-type-assertion
const featureCache = <{ [adr: string]: { [feature: string]: boolean } }>{}
const features = Object.keys(validationDef.ContractFeatures.properties).reduce(
  (p, v) => ({ ...p, [v]: validationDef.ContractFeatures.properties[v].val }),
  {})

async function hasCachedFeature(c: contracts.interfaces.EIP165, name: string) {
  const cache = featureCache[c.address] || (featureCache[c.address] = {})
  if (cache[name] !== undefined) return cache[name]
  return c.supportsInterface(features[name]).then(_ => cache[name] = _)
}

export async function getAllFeatures(contract: string): Promise<ContractFeatures> {
  if (contract.indexOf('@') > 0)
    contract = (await registry.resolveURL(contract)).contract
  const c = contracts.interfaces.EIP165.at(toAdr(contract), web3)
  const flist = await Promise.all(Object.keys(features).map(_ => hasCachedFeature(c, _)))
  return Object.keys(features).reduce((p, v, i) => ({ ...p, [v]: flist[i] }), {}) as ContractFeatures
}

export async function hasFeatures(contract: string, feature: string): Promise<boolean> {
  if (contract.indexOf('@') > 0)
    contract = (await registry.resolveURL(contract)).contract
  const cache = featureCache[contract] || (featureCache[contract] = {})
  return cache[feature] !== undefined
    ? cache[feature]
    : hasCachedFeature(contracts.interfaces.EIP165.at(toAdr(contract), web3), feature)
}
