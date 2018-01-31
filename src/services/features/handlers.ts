import { features, ENS } from '../../contracts'
import Device from '../device'
import * as ethUtil from '../../utils/eth'
import { TransactionReceipt } from '../../types/types'
import { toNumber } from '../../utils/validate'
import { DeviceState } from '../../types/meta'

const NULLADR = ethUtil.NULLADR
/**
 * 
 */

export class DepositHandler {

  readonly device: Device

  constructor(device: Device) {
    this.device = device
  }

  async returnDeposit() {
    return features.DepositSupport.at(this.device.contract, this.device.web3).returnDeposit(this.device.user, this.device.deviceId)
  }

  async storedDeposit() {
    const c = features.DepositSupport.at(this.device.contract, this.device.web3)
    return c.storedDeposit(this.device.user, this.device.deviceId).then(_ => ({
      amount: toNumber(_.amount),
      token: _.token,
      access: _.access.toNumber()
    }))
  }

  async deposit(secondsToRent = 3600) {
    const c = features.DepositSupport.at(this.device.contract, this.device.web3)
    return c.deposit(this.device.deviceId, this.device.user, secondsToRent, this.device.token).then(toNumber)
  }

  isSupported() {
    return this.device.hasFeature('deposit')
  }

}

export class TimeRangeHandler {

  readonly device: Device

  constructor(device: Device) {
    this.device = device
  }

  async getTimeRange() {
    const c = features.TimeRangeSupport.at(this.device.contract, this.device.web3)
    return c.getRangeSeconds(this.device.deviceId).then(_ => ({ min: _.min.toNumber(), max: _.max.toNumber() }))
  }

  async setTimeRange(min: number, max: number) {
    const c = features.TimeRangeSupport.at(this.device.contract, this.device.web3)
    return c.setRangeSeconds(this.device.deviceId, min, max, { from: this.device.user })
  }

  isSupported() {
    return this.device.hasFeature('timeRange')
  }

}

export class WhitelistHandler {

  readonly device: Device

  constructor(device: Device) {
    this.device = device
  }

  async setAccessWhitelist(user: string, allowed = true) {
    return features.WhitelistSupport.at(this.device.contract, this.device.web3).setAccessWhitelist(this.device.deviceId, user, allowed)
  }

  async getAllowedUsers() {
    return features.WhitelistSupport.at(this.device.contract, this.device.web3)
      .getLogAccessChanged({ filter: { id: this.device.deviceId }, fromBlock: 1 })
      .then(logs => {
        const result = {}
        logs.forEach(e => result[(<any>e.returnValues).controller] = (<any>e.returnValues).permission)
        return result
      })
  }

  isSupported() {
    return this.device.hasFeature('accessWhiteList')
  }

}

// tslint:disable-next-line:max-classes-per-file
export class TokenHandler {

  readonly device: Device

  constructor(device: Device) {
    this.device = device
  }

  async setTokens(tokens: string[]) {
    return features.TokenSupport.at(this.device.contract, this.device.web3)
      .setSupportedTokens(this.device.deviceId, tokens, { from: this.device.user })
  }

  isSupported() {
    return this.device.hasFeature('multiTokens')
  }

}

// tslint:disable-next-line:max-classes-per-file
export class GroupedHandler {

  readonly device: Device

  constructor(device: Device) {
    this.device = device
  }

  async getDeviceCountInGroup() {
    return features.GroupedSupport.at(this.device.contract, this.device.web3).getCount(this.nameHash).then(_ => _.toNumber())
  }

  /**
   * tries to find the first device with the same name (other then the current)
   * which is rentable.
   * It will loop through the next maxtSteps ids and check. 
   * returns null if none was found or a new Device-Instance for the available id.
   * 
   * @param {number} [maxSteps=100] 
   * @returns 
   * @memberof Device
   */
  async findNextRentableDevice(maxSteps = 100) {
    const c = this.device.renting.rentingContract
    const nHash = this.nameHash
    const myCounter = this.deviceCounter

    const urlP = Device.parseURL(this.device.url)
    // tslint:disable-next-line:no-increment-decrement
    for (let i = 0; i < maxSteps; i++) {
      const id = nHash + ethUtil.toHex(i).substr(2)
      if (i !== myCounter && (await c.getRentingState(id, this.device.user).then(s => s.rentable && s.free && s.open)))
        return Device.fromEvent(
          this.device.contract,
          id, this.device.user, this.device.token, this.device.web3, urlP.deviceName + '#' + i + '@' + urlP.contractName)
    }
    return null
  }

  /**
   * returns the first 24 bytes of the deviceId, 
   * which are also the first 24 bytes of the hash created by using sha256 on the name of the device.
   * 
   * @readonly
   * @memberof Device
   */
  get nameHash() {
    return ethUtil.getNameHash(this.device.deviceId)
  }

  /**
   * 
   * @readonly
   * @memberof Device
   */
  get deviceCounter() {
    return ethUtil.getCounter(this.device.deviceId)
  }

  isSupported() {
    return this.device.hasFeature('grouped')
  }

}

// tslint:disable-next-line:max-classes-per-file
export class VerifiedDeviceHandler {

  readonly device: Device

  constructor(device: Device) {
    this.device = device
  }

  async setDevicePubKey(adr: string) {
    return features.VerifiedDeviceSupport.at(this.device.contract, this.device.web3)
      .setDevicePubKey(this.device.deviceId, adr, { from: this.device.user })
  }

  async devicePubKey() {
    return features.VerifiedDeviceSupport.at(this.device.contract, this.device.web3).devicePubKey(this.device.deviceId)
  }

  isSupported() {
    return this.device.hasFeature('verifiedDevice')
  }

}

// tslint:disable-next-line:max-classes-per-file
export class OwnerHandler {

  readonly device: Device

  constructor(device: Device) {
    this.device = device
  }

  async deviceOwner() {
    return features.OwnerSupport.at(this.device.contract, this.device.web3).deviceOwner(this.device.deviceId)
  }

  isSupported() {
    return this.device.hasFeature('owner')
  }

}

// tslint:disable-next-line:max-classes-per-file
export class AccessHandler {

  readonly device: Device

  constructor(device: Device) {
    this.device = device
  }

  /**
   * checks if a ActionMessage would be accepted. 
   * 
   * @param {string} [action='0x00'] 
   * @returns 
   * @memberof Device
   */
  async canAccess(action = '0x00', state?: DeviceState) {
    if (state && state.rentingState && state.rentingState.controller === this.device.user) return true
    return features.AccessSupport.at(this.device.contract, this.device.web3)
      .canAccess(this.device.deviceId, this.device.user, action)
  }

  /**
   * checks if the current user has access to the device.
   * 
   * @param {string} [action] 
   * @param {{ controller: string, rentedUntil: number }} [prevState] 
   * @returns 
   * @memberof Device
   */
  async checkAccess(action?: string, prevState?: { controller: string, rentedUntil: number }) {
    if (!prevState) prevState = await this.device.renting.isSupported()
      && await this.device.renting.getRentingState().then(_ => ({ controller: _.controller, rentedUntil: _.rentedUntil }))
    return (!prevState || !await this.device.hasFeature('offChain'))
      ? false
      : features.OffChainSupport.at(this.device.contract, this.device.web3).canAccessIf(
        this.device.deviceId, this.device.user, action || '0x0', prevState.controller || NULLADR, prevState.rentedUntil || 0)
  }

  isSupported() {
    return this.device.hasFeature('access')
  }

}
