import * as w3 from '../types/types.d'
import Web3 from '../types/web3'
// tslint:disable-next-line:no-var-requires
const _Web3 = require('web3')
import config from './config'

/**
 * create the default web3.
 */
const web3: Web3 = new _Web3(config.eth.clients[0])

export default web3