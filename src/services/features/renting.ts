/**
 * Searches for devices
 */
// tslint:disable:no-conditional-assignment

import * as contracts from '../../contracts'
import Device from '../device'
import { toNumber } from '../../utils/validate'
import { NULLADR } from '../../utils/eth'
import { DeviceState } from '../../types/meta'
import { EventEmitter, TransactionReceipt } from '../../types/types'

export class RentingHandler {

  readonly device: Device

  constructor(device: Device) {
    this.device = device
  }

  isSupported() {
    return this.device.hasFeature('renting')
  }

  isRentForSupported() {
    return this.device.hasFeature('rentFor')
  }

  get rentingContract() {
    return contracts.features.RentingSupport.at(this.device.contract, this.device.web3)
  }

  get rentForContract() {
    return contracts.features.RentForSupport.at(this.device.contract, this.device.web3)
  }

  /**
   * returns the price for the device.
   * 
   * @param {number} [seconds=3600] number of seconds you want to rent it
   * @param {string} [token] the curreny for the token.
   * @returns 
   * @memberof Device
   */
  async getPrice(seconds = 3600, token?: string) {
    return this.rentingContract.price(this.device.deviceId, this.device.user, seconds, token || this.device.token).then(toNumber)
  }

  /**
   * returns the current state.
   * 
   * @returns 
   * @memberof Device
   */
  async getRentingState(includeOffChain = true): Promise<{
    rentable: boolean
    open: boolean
    free: boolean
    controller: string
    rentedUntil: number
    rentedFrom: number
    physicalState: {
      internalId?: string
      state?: string
      domain?: {
        name?: string
        services?: string[]
      }
      lastUpdated?: number
    }
    timestamp: number
    states: {
      controller: string
      rentedUntil: number
      rentedFrom: number
    }[]
  }> {
    const [onChain, offChain, blockTime] = await Promise.all([
      this.rentingContract.getRentingState(this.device.deviceId, this.device.user),
      includeOffChain ? undefined : this.device.sendReadStateMessageRequest().catch(_ => undefined),
      this.device.web3.eth.getBlock('latest').then(_ => toNumber(_.timestamp))
    ])
    const now = offChain ? offChain.timestamp : blockTime
    const r = {
      rentable: onChain.rentable,
      open: onChain.open,
      free: onChain.free,
      controller: onChain.controller,
      rentedUntil: toNumber(onChain.rentedUntil),
      rentedFrom: toNumber(onChain.rentedFrom),
      physicalState: offChain ? offChain.physicalState : undefined,
      timestamp: now,
      states: offChain
        ? offChain.states
        : await this.isRentForSupported()
          ? [{ controller: onChain.controller, rentedUntil: toNumber(onChain.rentedUntil), rentedFrom: toNumber(onChain.rentedFrom) }]
          : toNumber(onChain.rentedUntil)
            ? [{ controller: onChain.controller, rentedUntil: toNumber(onChain.rentedUntil), rentedFrom: toNumber(onChain.rentedFrom) }]
            : []
    }

    // update the current based on the states
    Object.assign(
      r,
      r.states.find(_ => _.rentedFrom <= now && _.rentedUntil > now) || { controller: undefined, rentedUntil: 0, rentedFrom: 0 })
    r.free = !r.rentedUntil
    return r
  }

  /**
   * returns the address of the receiver of tokens
   * 
   * @param {string} [token] 
   * @returns 
   * @memberof Device
   */
  async getTokenReceiver(token?: string) {
    return this.rentingContract.tokenReceiver(this.device.deviceId, token || this.device.token)
  }

  /**
   * rents a device.
   * @param seconds the timespan in seconds
   * @param start the start time
   * @param payer the address of the user paying for it.
   */
  // tslint:disable-next-line:cyclomatic-complexity
  async rent(seconds = 3600, start?: number, payer?: string, method = 'tx') {
    if (! await this.isSupported()) throw new Error('This contract does not support renting!')

    // use the device as a helper-class
    const device = this.device
    const now = Math.round(Date.now() / 1000)
    const rentFrom = start || now
    const rentUntil = rentFrom + seconds

    // read needed values from the blockchain
    const [s, price, deposit, storedDeposit, props, tokenReceiver] = await Promise.all([
      this.getRentingState(),
      this.getPrice(seconds),
      (await device.deposit.isSupported()) ? device.deposit.deposit(seconds) : 0,
      (await device.deposit.isSupported()) ? device.deposit.storedDeposit() : { amount: 0, token: undefined, access: 0 },
      device.getProperties(),
      this.getTokenReceiver(device.token)
    ])

    if (!s.rentable) throw new Error('ERRKEY: not_rentable : The device is currently not rentable')

    const existingState = s.states.find(_ => rentUntil >= _.rentedFrom && rentFrom < _.rentedUntil)

    // conflict with other states?
    if (existingState && existingState.controller !== device.user)
      throw new Error('ERRKEY: already_rented : you cannot rent it, because during this time it is already rented by someone else!')

    // can we extend it long enough?
    if (existingState && existingState.controller === device.user &&
      s.states.find(_ => existingState.rentedUntil + seconds >= _.rentedFrom && existingState.rentedUntil < _.rentedUntil))
      throw new Error('ERRKEY: already_rented : you cannot extend the rent, because during this time it is already rented by someone else!')

    // the price depends on whether we are extendong or not and whether there is a already stored deposit we can use.
    const toPay = price + (deposit ? Math.max(0, deposit - storedDeposit.amount) : 0)

    // balance is only calculated if we use statechannels, in all other the check-function will do this job.
    const txArgs = { from: payer || device.user, value: 0, gas: 800000 }

    // if ERC20, we need to approve first
    if (device.token !== NULLADR)
      await contracts.interfaces.ERC20.at(device.token, device.web3).approve(device.contract, toPay)
    else
      txArgs.value = toPay

    if (start || payer) {
      await this.checkRentFor()
      if (!await this.canBeRented(start || now, seconds))
        throw new Error('ERRKEY: device_already_booked :the device is not available at this time ')
      else
        await this.rentForContract.rentFor(
          device.deviceId, seconds, device.token, device.user, start || now, txArgs)
    }
    else
      return this.rentingContract.rent(device.deviceId, seconds, device.token, txArgs)
  }

  /**
   * returns the device.
   * @param method 
   */
  async returnObject(method?: 'tx' | 'stateChannel') {
    if (method === 'stateChannel')
      throw new Error('errkey: no_return_possible : returning objects is only needed when using transacitons')
    else
      await this.rentingContract.returnObject(this.device.deviceId, { from: this.device.user, gas: 300000 })
  }

  async removeBooking(start: number) {
    await Promise.all([
      this.checkRentFor(),
      this.rentForContract.removeBooking(this.device.deviceId, start, { from: this.device.user })
    ])
  }

  async canBeRented(start: number, secondsToRent: number) {
    return Promise.all([
      this.checkRentFor(),
      this.rentForContract.canBeRented(this.device.deviceId, this.device.user, start, secondsToRent)
    ]).then(_ => _[1])
  }

  /**
   * 
   * returns the owners address
   * 
   * @returns 
   * @memberof Device
   */
  async getSupportedTokens() {
    return this.rentingContract.supportedTokens(this.device.deviceId)
  }

  /**
   * returns true if the user can rent the device.
   * @param state optional state, if given, the decision is based on the given, state otherwise, a request to the contract is made.
   */
  async canRent(state?: DeviceState) {
    const rentingState = (state && state.rentingState)
      ? state.rentingState
      : await this.getRentingState()
    return rentingState
      && rentingState.rentable
      && (rentingState.free || (rentingState.states && !rentingState.states.find(_ => _.controller === this.device.user) && await this.isRentForSupported()))
      && this.device.user !== ((state && state.owner) ? state.owner : (await this.device.owner.deviceOwner()))
  }

  /**
   * returns true if the user can rent the device.
   * @param state optional state, if given, the decision is based on the given, state otherwise, a request to the contract is made.
   */
  async canReturn(state?: DeviceState) {
    const rentingState = (state && state.rentingState)
      ? state.rentingState
      : await this.getRentingState()
    return rentingState.controller === this.device.user
  }

  /**
   * a eventemitter hanling events for ever Rented-event. 
   * 
   * @param {(ev: { deviceId: string, rentedUntil: number, controller: string, noReturn: boolean }) => void} [fn] 
   * @returns {EventEmitter} 
   * @memberof Device
   */
  subscribeToRented(fn?: (ev: {
    deviceId: string, rentedUntil: number, controller: string, noReturn: boolean, amount: number, token: string
  }) => void): EventEmitter {
    return this.rentingContract.subscribeLogRented().on('data', ev => {
      const vals = ev.returnValues
      if (fn && vals.id === this.device.deviceId)
        fn({
          deviceId: vals.id,
          controller: vals.controller,
          rentedUntil: this.device.web3.utils.toBN(vals.rentedUntil).toNumber(),
          noReturn: vals.noReturn,
          amount: toNumber(this.device.web3.utils.toBN(vals.amount)),
          token: vals.token
        })
    })
  }

  /**
   * check if the device could be rented.
   * 
   * @param {number} seconds 
   * @param {number} [balance] 
   * @param {number} [amount] 
   * @param {string} [receiver] 
   * @param {{ deposit?: number, controller: string, rentedUntil: number, depAccess?: number }} [prevState] 
   * @returns 
   * @memberof Device
   */
  // tslint:disable-next-line:cyclomatic-complexity
  async checkRent(
    seconds: number, balance?: number, amount?: number, receiver?: string,
    prevState?: {
      deposit?: number, controller: string, rentedUntil: number, depAccess?: number, states?: {
        controller: string // address
        rentedUntil: number
        rentedFrom: number
      }[]
    },
    rentedFrom?: number, payer?: string
  ) {
    if (await this.device.hasFeature('offChain')) {
      if (!prevState) prevState = await this.getRentingState()
        .then(_ => ({ controller: _.controller, rentedUntil: _.rentedUntil, deposit: undefined, states: _.states }))
      if (prevState.deposit === undefined) {
        if (await this.device.deposit.isSupported()) {
          const d = await this.device.deposit.storedDeposit()
          if (d.amount && d.token !== this.device.token)
            throw new Error('ERRKEY: wrong_token : The deposit was stored in a different token then the current one!')
          else prevState.deposit = d.amount
        }
        else
          prevState.deposit = 0
      }
      if (!receiver) receiver = await this.getTokenReceiver()

      if (seconds === null) {
        if (amount === undefined) throw new Error('ERRKEY: no_amount : the seconds and the amount are undefined')
        seconds = (prevState.rentedUntil > new Date().getTime() / 1000 && prevState.controller === this.device.user)
          ? Math.round(amount * 3600 / await this.getPrice())
          : Math.round((amount - await this.device.deposit.deposit()) * 3600 / await this.getPrice())
        if (seconds < 0) throw new Error('ERRKEY: amount_too_low : With this amount you cannot rent this device. ')
      }
      if (amount === undefined) {
        amount = prevState.rentedUntil > new Date().getTime() / 1000
          ? await this.getPrice(seconds)
          : await Promise.all([this.getPrice(seconds), this.device.deposit.deposit(seconds)]).then(_ => _[0] + _[1])
      }

      if (balance === undefined) {
        balance = this.device.token === NULLADR
          ? balance = await this.device.web3.eth.getBalance(this.device.user)
          : balance = await contracts.interfaces.ERC20.at(this.device.token, this.device.web3).balanceOf(this.device.user).then(toNumber)
      }

      if (balance < amount) throw new Error('ERRKEY : balance_too_low : the balance of the user is lower than the required amount.')

      const res = await contracts.features.OffChainSupport.at(this.device.contract, this.device.web3).rentIf(
        this.device.deviceId, seconds, '' + amount, this.device.token, this.device.user, receiver,
        prevState.controller, parseInt(prevState.rentedUntil as any, 10), '' + prevState.deposit)

      const error = parseInt(res[0])
      if (error) {
        const errors = ['no refund is not supported', 'not rentable', 'not open (weekcalendar)',
          'token not supported', 'wrong tokenreceiver', ' still rented by someone else', 'not allowed to extend time',
          'price paid is not correct', 'the secondsToRent are too short', 'the secondsToRent are too long'
        ]
        throw new Error('ERRKEY: not_reantable: ' + errors[error - 1])
      }
      // (uint16 error, uint64 rentedUntilAfter, uint128 deposit, uint64 depositAccess);
      return ({
        amount,
        seconds,
        balance,
        receiver,
        prevState,
        postState: {
          deposit: parseInt(res[2]),
          depAccess: parseInt(res[3]),
          controller: this.device.user,
          rentedUntil: parseInt(res[1])
        }
      })
    }
  }

  private async checkRentFor() {
    if (!await this.isRentForSupported())
      throw new Error('ERRKEY: rentFor_not_supported :renting for is not supported!')
  }

  private async rentFor(rentedFrom: number, seconds: number, payer: string, amount: number) {
    await this.rentForContract.rentFor(
      this.device.deviceId, seconds, this.device.token, this.device.user, rentedFrom || Math.round(Date.now() / 1000),
      { from: payer || this.device.user })
  }

}
