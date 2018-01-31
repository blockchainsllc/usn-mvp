// tslint:disable:function-name
// tslint:disable-next-line:missing-jsdoc
import * as request from 'axios'
import { ENS, interfaces, features as f } from '../contracts'
import { EventEmitter, TransactionReceipt } from '../types/types'
import { ActionMessage, Signature, StateMessage, ReadStateMessageResponse, ReadStateMessageRequest } from '../types/messages'
import { Metadata, ContractFeatures, DeviceProperties, DeviceState, validateMetadata, validateDeviceState } from '../types/meta'
import * as util from '../utils/copy'
import { isValidAddress, isZeroAddress, verifyValidAddress, getNameHash, toAdr, toHex, NULLADR, getCounter } from '../utils/eth'
import config from './config'
import web3 from './web3'
import * as hub from './hub'
import * as features from './features/handlers'
import * as deviceProps from './deviceProperties'
import * as featureUtil from './features'
import * as registry from './registry'
import * as metaUtil from './meta'
import Web3 from '../types/web3'
import * as logger from '../utils/logger'
import { toNumber } from '../utils/validate'
import { RentingHandler } from './features/renting'

/**
 * this class represents a Device, for a given user.
 * The user is important, since a lot of properties depend on who the user is.
 * 
 * @export
 * @class Device
 */
export default class Device {
  /**
   * the address of the contract.
   * 
   * @type {string}
   * @memberof Device
   */
  readonly contract: string
  /**
   * the deviceId, which is a 32byte long identifier as hex.
   * 
   * @type {string}
   * @memberof Device
   */
  readonly deviceId: string

  /**
   * the user all calculation are done for.
   * 
   * @type {string}
   * @memberof Device
   */
  readonly user: string

  /**
   * 
   * the currency used as unit for the prices.
   * 
   * @type {string}
   * @memberof Device
   */
  readonly token: string

  /**
   * the web3-object used for interacting with the contract.
   * 
   * @memberof Device
   */
  readonly web3: Web3

  /**
   * the delta to be applied to the current timestamp in order to send valid messages.
   */
  timeDelta: number

  /**
   * the url of the device 
   */
  readonly url: string

  private constructor(contract: string, deviceId: string, user = NULLADR, token = NULLADR, w3 = web3, url?) {
    this.contract = contract
    this.deviceId = deviceId
    this.user = user
    this.token = token
    this.web3 = w3 || web3
    this.url = url
  }

  /**
   * creates a instance based on a URL of the device.
   * 
   * parses a url, which can in any of these forms:
   * - <deviceName>.<contractName>
   * - <deviceName>@<contractName>
   * - <deviceName>@<contractName>#counter
   * - <contractName>#<deviceName>
   * 
   * if the contractName starts with 0x the address is taken, otherwise the ENS will be used to resolve the name. 
   * the contractName may be a full name like myName.usn.eth or just myName.usn or even the name only like myName
   * 
   * if the deviceName starts with 0x the identifier is taken as is, otherwise the sha256 is used to generate the deviceId out of the name.
   * 
   * if (a counter is given)
   * 
   * @static
   * @param {string} url 
   * @param {any} [user=NULLADR] 
   * @param {any} [token=NULLADR] 
   * @returns {Promise<Device>} 
   * @memberof Device
   */
  static async fromUrl(url: string, user = NULLADR, token?: string): Promise<Device> {
    const node = await registry.resolveURL(url)
    return new Device(
      node.contract,
      node.deviceId,
      user,
      token || await Device.getDefaultToken(node.contract, node.deviceId, web3),
      web3,
      node.url
    )
  }

  /**
   * creates a device by simply specifying the contract and deviceId. 
   * In this case the user is empty and prices are currently only given in ether.
   * 
   * @static
   * @param {string} contract 
   * @param {string} deviceId 
   * @returns {Promise<Device>} 
   * @memberof Device
   */
  static async fromEvent(contract: string, deviceId: string, user = NULLADR, token?: string, w3 = web3, url?: string): Promise<Device> {
    if (!url) {
      const meta = await Device.getMeta(contract, deviceId, w3)
      if (meta && meta.url) {
        url = meta.url
        if (getCounter(deviceId))
          url = url.replace(/#[0-9]+/, '') + '#' + getCounter(deviceId)
      }
    }
    const p = registry.parseURL(url)
    if (!p) throw new Error('ERRKEY: invalid_url : ' + url)
    if (p.deviceId !== deviceId)
      throw new Error('ERRKEY: invalid_deviceId : The deviceId from the URL does not equal the given id ' + p.deviceId + ' != ' + deviceId)

    return new Device(contract, deviceId, user, token || await Device.getDefaultToken(contract, deviceId, w3), w3, url)
  }

  /**
   * creates a device by simply specifying the contract and deviceId. 
   * In this case the user is empty and prices are currently only given in ether.
   * 
   * @static
   * @param {string} contract 
   * @param {string} deviceId 
   * @returns {Promise<Device>} 
   * @memberof Device
   */
  static async fromState(state: DeviceState, user?: string, token?: string, w3 = web3, url?: string): Promise<Device> {
    if (!url) url = state.url || state.meta.url
    if (!url) {
      const meta = await Device.getMeta(state.contract, state.deviceId, w3)
      if (meta && meta.url)
        url = meta.url
    }
    // fix counter in url taken from the deviceId
    if (getCounter(state.deviceId)) {
      const pu = registry.parseURL(url)
      url = pu.deviceName + '#' + getCounter(state.deviceId) + '@' + pu.contractName
    }
    const p = registry.parseURL(url)
    if (!p) throw new Error('ERRKEY: invalid_url : ' + url)
    if (p.deviceId !== state.deviceId)
      throw new Error('ERRKEY: invalid_deviceId : The deviceId from the URL does not equal the given id '
        + p.deviceId + ' != ' + state.deviceId)

    return new Device(
      state.contract, state.deviceId,
      user || NULLADR, token || state.token || await Device.getDefaultToken(state.contract, state.deviceId, w3),
      w3, url)
  }

  /**
   * deploys a new contract and 
   * @param name the dns-name
   * @param user the user
   * @param contract the contract-class
   */
  static async createContract<T extends interfaces.EIP165>(
    name: string, user: string,
    contract: { deploy(ens: string, rootNode: string, tx: any, web3?: Web3): Promise<T> },
    w3 = web3) {
    const registrar = await registry.getUSNRegistrar()
    const nodeId = web3.utils.sha3(toHex(name))

    // check, if the name is already registered.
    // if not, try register the name.
    await registry.resolveURL('0x0@' + name)
      .catch(() =>
        ENS.USNRegistrar.at(registrar).registerObject(nodeId, user, { from: user })
      )

    // deploy the contract
    const usnResolver = ENS.USNResolver.at(config.contracts.registry)
    const c = await contract.deploy(await usnResolver.ens(), await usnResolver.rootNode(), { from: user }, w3 || web3)

    // set the new contract in the registry
    await usnResolver.setAddress(nodeId, c.address, { from: user })

    // return contract
    return c
  }

  /**
   * parses the url
   * 
   * @static
   * @param {string} url 
   * @returns 
   * @memberof Device
   */
  static parseURL(url: string) {
    return registry.parseURL(url)
  }

  /**
   * normailizes the url
   * 
   * @static
   * @param {string} url 
   * @returns 
   * @memberof Device
   */
  static normailze(url: string) {
    return registry.normalizeURL(url)
  }

  /**
   * retrieves thd token in which the prices are defined.
   * 
   * @private
   * @static
   * @param {string} contract 
   * @param {string} deviceId 
   * @returns 
   * @memberof Device
   */
  private static async getDefaultToken(contract: string, deviceId: string, w3 = web3) {
    return await featureUtil.hasFeatures(contract, 'renting')
      ? f.RentingSupport.at(contract, w3 || web3).supportedTokens(deviceId).then(_ => _[0] || NULLADR)
      : NULLADR
  }

  /**
   * retrieves the Metadata for a device
   * 
   * @private
   * @static
   * @param {string} contract 
   * @param {string} deviceId 
   * @returns 
   * @memberof Device
   */
  private static async getMeta(contract: string, deviceId: string, w3 = web3): Promise<Metadata> {
    if (! await featureUtil.hasFeatures(contract, 'meta'))
      throw new Error('This contract does not support meta-data')
    const hash = await f.MetaSupport.at(contract, w3 || web3).meta(deviceId)
      .then(_ => web3.utils.toUtf8(_)).catch(_ => '')
    return hash ? metaUtil.retrieveJson(hash) : undefined
  }

  /**
   * creates a new Device-Object, which is now connected to a different user and/or token
   * 
   * @param {string} user 
   * @returns 
   * @memberof Device
   */
  forUser(user: string, token?: string) {
    // tslint:disable-next-line:possible-timing-attack
    return (user === this.user && (!token || token === this.token))
      ? this
      : new Device(this.contract, this.deviceId, user, token || this.token, this.web3, this.url)
  }

  // -------- features -------

  /** 
   * if the owner-feature is supported, this will give you additional owner functions 
   */
  get owner() {
    return new features.OwnerHandler(this)
  }
  /** 
   * if the access-feature is supported, this will give you additional access functions 
   */
  get access() {
    return new features.AccessHandler(this)
  }

  /** 
   * if the deposit-feature is supported, this will give you additional deposit functions 
   */
  get deposit() {
    return new features.DepositHandler(this)
  }

  /**
   * if the timeRange-feature is supported, this will give you additional timeRange functions 
   * 
   * @readonly
   * @memberof Device
   */
  get timeRange() {
    return new features.TimeRangeHandler(this)
  }

  /**
   * if the access-feature is supported, this will give you additional access functions 
   * 
   * @readonly
   * @memberof Device
   */
  get whitelist() {
    return new features.WhitelistHandler(this)
  }

  /**
   * if the multiTokens-feature is supported, this will give you additional multiTokens functions 
   * 
   * @readonly
   * @memberof Device
   */
  get multiTokens() {
    return new features.TokenHandler(this)
  }

  /**
   * if the device is verifiyable, this will give you the public address, if available. 
   */
  get verifiedDevice() {
    return new features.VerifiedDeviceHandler(this)
  }

  /**
   * if the grouped-feature is supported, this will give you additional grouped functions 
   * 
   * @readonly
   * @memberof Device
   */
  get grouped() {
    return new features.GroupedHandler(this)
  }

  /**
   * if the renting-feature is supported, this will give you additional renting functions 
   * 
   * @readonly
   * @memberof Device
   */
  get renting() {
    return new RentingHandler(this)
  }

  /**
   * returns the properties of a device.
   * 
   * @returns 
   * @memberof Device
   */
  async getProperties() {
    return await this.hasFeature('meta')
      ? f.MetaSupport.at(this.contract, this.web3).properties(this.deviceId).then(v => deviceProps.toDeviceProperties(v[0]))
      : deviceProps.toDeviceProperties('0x00')
  }

  /**
   * checks if the contract supports the given featur. The name must be one of the keys of 
   * @see search.Features
   * 
   * @param {string} featureName 
   * @returns 
   * @memberof Device
   */
  async hasFeature(featureName: string) {
    return featureUtil.hasFeatures(this.contract, featureName)
  }

  /**
   * 
   * returns a Object holding all available features.
   * 
   * @returns 
   * @memberof Device
   */
  async getAllFeatures() {
    return featureUtil.getAllFeatures(this.contract)
  }

  /**
   * checks if the current user is the owner of the device.
   * 
   * @param state optional state, if given, the decision is based on the given, state otherwise, a request to the contract is made.
   * @returns 
   * @memberof Device
   */
  async canUpdate(state?: DeviceState) {
    if (this.user === NULLADR) return false
    const owner = (state && state.owner) || (await this.owner.isSupported() && await this.owner.deviceOwner())
    if (!owner) return false
    return owner === NULLADR || toAdr(owner) === toAdr(this.user)
  }

  /**
   * returns the metadata or undefined if not set yet
   */
  get meta(): Promise<Metadata> {
    return this.hasFeature('meta').then(_ => !_
      ? undefined
      : f.MetaSupport.at(this.contract, this.web3).meta(this.deviceId)
        .then(m => metaUtil.retrieveJson(web3.utils.toUtf8(m)))
        .catch(m => undefined)
    )
  }

  /**
   * get the Device type and services.
   * 
   * if you pass a existing state it will use this instead of fetching the if from ipfs
   * 
   * @param {DeviceState} [state] 
   * @returns {Promise<{ name: string, services: string[] }>} 
   * @memberof Device
   */
  async getDevicesType(state?: DeviceState): Promise<{ name: string, services: string[] }> {
    const m = (state && state.meta) || await this.meta
    return m && m.device
  }

  async sendStateMessage(msg: StateMessage): Promise<StateMessage> {
    return hub.sendMessage({ ...msg, url: this.url })
  }

  /**
   * sends a signed action message using the message-hub.
   * 
   * @param {string} action 
   * @param {*} meta 
   * @returns 
   * @memberof Device
   */
  async sendActionMessage(action: string, meta: any = {}): Promise<ActionMessage> {
    // tslint:disable-next-line:no-object-literal-type-assertion
    const message = <ActionMessage>{
      url: this.url,
      msgType: 'action',
      timestamp: Math.round(new Date().getTime() / 1000) + (this.timeDelta || 0),
      action,
      metadata: meta
    }
    message.signature = <any>web3.eth.accounts.sign(
      message.url
      + message.timestamp
      + message.action
      + JSON.stringify(meta),
      this.user)
    return hub.sendMessage(message)
  }

  async sendReadStateMessageRequest(): Promise<ReadStateMessageResponse> {
    const msg: ReadStateMessageRequest = {
      url: this.url,
      msgType: 'read',
      timestamp: Math.round(Date.now() / 1000)
    }
    const response: ReadStateMessageResponse = await hub.sendMessage(msg)
    if (response.timestamp)
      this.timeDelta = Math.round(response.timestamp - Date.now() / 1000)
    return response
  }

  /**
   * the name of the contract
   * 
   * @readonly
   * @type {string}
   * @memberof Device
   */
  get contractName(): string {
    const p = registry.parseURL(this.url)
    return p ? p.contractName : undefined
  }

  /**
   * the nodeid of the contract
   * 
   * @readonly
   * @type {string}
   * @memberof Device
   */
  get nodeid(): string {
    const p = registry.parseURL(this.url)
    return p ? p.nodeId : undefined
  }

  /**
   * the name of the device
   * 
   * @readonly
   * @type {string}
   * @memberof Device
   */
  get deviceName(): string {
    const p = registry.parseURL(this.url)
    return p ? p.deviceName : undefined
  }

  /**
   * the counter of a device
   * 
   * @readonly
   * @type {string}
   * @memberof Device
   */
  get deviceCounter(): number {
    const p = registry.parseURL(this.url)
    return p ? p.counter : this.grouped.deviceCounter
  }

}
