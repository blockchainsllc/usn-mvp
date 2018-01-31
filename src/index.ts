/**
 * This file is part of usn-lib.
 * 
 * It is subject to the terms and conditions defined in
 * file 'LICENSE.', which is part of this source code package.
 *
 * @author Simon Jentzsch 
 * @version 0.9
 * @copyright 2017 by Slock.it GmbH
 */
import Web3 from './types/web3'
import _web3 from './services/web3'
export const web3: Web3 = _web3

import * as Ajv from 'ajv'
import * as _contracts from './contracts'
import _config from './services/config'
import _Device from './services/device'
import * as _hub from './services/hub'

import * as _messages from './types/messages'
import * as _meta from './types/meta'
import * as _configType from './types/config'

import * as copy from './utils/copy'
import * as _utilEth from './utils/eth'
import * as _logger from './utils/logger'
import * as _validate from './utils/validate'
import * as _props from './services/deviceProperties'

export const contracts = _contracts
export const config = _config
export const Device = _Device
export const util = {
    eth: _utilEth,
    util: copy,
    logger: _logger,
    ajv: _validate,
    props: _props
}

export namespace types {
    export type ActionMessage = _messages.ActionMessage
    export type Signature = _messages.Signature
    export type StateMessage = _messages.StateMessage
    export type Metadata = _meta.Metadata
    export type ReadStateMessageRequest = _messages.ReadStateMessageRequest
    export type ReadStateMessageResponse = _messages.ReadStateMessageResponse
    export type Config = _configType.USNConfig
    export type ErrorResponse = _messages.ErrorResponse

    export const messages = _messages
    export const meta = _meta
    export const conf = _configType
}