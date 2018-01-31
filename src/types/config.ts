import { ajv, validateAndThrow } from '../utils/validate'
import * as Ajv from 'ajv'
/**
 * the definition of the config-file.
 */
export interface USNConfig {
    /**
     * ethereum- connection
     */
    eth?: {
        /**
         * the urls of the available clients. Each url must be either a http(s), ws-url or a ipc-path
         * example: http://myremote-client:8545,ws://mylocalclient:84,myipc-path
         */
        clients?: string[]
    }
    /**
     * a list of base-contracts
     */
    contracts?: {
        /**
         * a simple map holding public profiles for addresses [ProfileRegistry.sol](https://github.com/slockit/usn-mvp/tree/develop/contracts/profiles)
         */
        profiles?: string // address
        /**
         * the [USN-Resolver](https://github.com/slockit/usn-mvp/blob/develop/contracts/ENS/USNResolver.sol)
         */
        registry?: string // address
        /**
         * the [USN-Registrar](https://github.com/slockit/usn-mvp/blob/develop/contracts/ENS/USNRegistrar.sol), used to register new ENS-Domains
         */
        usnRegistrar?: string // address
        /**
         * the [StatechannelManager](https://github.com/slockit/usn-mvp/tree/develop/contracts/states)
         */
        stateManager?: string // address
    }
    /**
     * the Services of the USN
     */
    services?: {
        /**
         * url of the statechannel manager
         * example: https://state-server-test.usn.slock.it
         */
        stateServer?: string // uri
        /**
         * url of the message hub
         * example: https://hub-test-usn.slock.it
         */
        hub?: string // uri
        /**
         * url of the search-service
         * example: https://search-test-usn.slock.it
         */
        search?: string // uri
    }
    /**
     * the directory where to store all config-files.
     * example: /etc/usn
     */
    configDir?: string
    /**
     * loggin-configuration
     */
    logger?: {
        /**
         * use colors in logfiles
         * example: true
         */
        colors?: boolean
        /**
         * append logfile
         */
        append?: boolean
        /**
         * Loglevel
         */
        level?: 'debug' | 'info' | 'warn' | 'error' | 'verbose' | 'silly'
        /**
         * path to the logfile
         * example: usn.log
         */
        file?: string
        /**
         * if true, all JSON-RPC-requests will be logged in the logfile in order to debug
         */
        logRPC?: boolean
    }
}
/* tslint:disable */
export const validationDef = { USNConfig: { description: 'the definition of the config-file.', type: 'object', properties: { eth: { description: 'ethereum- connection', type: 'object', additionalProperties: false, properties: { clients: { description: 'the urls of the available clients. Each url must be either a http(s), ws-url or a ipc-path', minItems: 1, type: 'array', example: ['http://myremote-client:8545', 'ws://mylocalclient:84', 'myipc-path'], items: { type: 'string' } } } }, contracts: { description: 'a list of base-contracts', type: 'object', additionalProperties: false, properties: { profiles: { description: 'a simple map holding public profiles for addresses [ProfileRegistry.sol](https://github.com/slockit/usn-mvp/tree/develop/contracts/profiles)', type: 'string', format: 'address' }, registry: { description: 'the [USN-Resolver](https://github.com/slockit/usn-mvp/blob/develop/contracts/ENS/USNResolver.sol)', type: 'string', format: 'address' }, usnRegistrar: { description: 'the [USN-Registrar](https://github.com/slockit/usn-mvp/blob/develop/contracts/ENS/USNRegistrar.sol), used to register new ENS-Domains', type: 'string', format: 'address' }, stateManager: { description: 'the [StatechannelManager](https://github.com/slockit/usn-mvp/tree/develop/contracts/states)', type: 'string', format: 'address' } } }, services: { description: 'the Services of the USN', type: 'object', additionalProperties: false, properties: { stateServer: { description: 'url of the statechannel manager', type: 'string', format: 'uri', example: 'https://state-server-test.usn.slock.it' }, hub: { description: 'url of the message hub', type: 'string', format: 'uri', example: 'https://hub-test-usn.slock.it' }, search: { description: 'url of the search-service', type: 'string', format: 'uri', example: 'https://search-test-usn.slock.it' } } }, configDir: { description: 'the directory where to store all config-files.', type: 'string', example: '/etc/usn' }, logger: { type: 'object', description: 'loggin-configuration', additionalProperties: false, properties: { colors: { description: 'use colors in logfiles', type: 'boolean', example: true }, append: { description: 'append logfile', type: 'boolean', example: false }, level: { description: 'Loglevel', type: 'string', enum: ['debug', 'info', 'warn', 'error', 'verbose', 'silly'] }, file: { description: 'path to the logfile', type: 'string', example: 'usn.log' }, logRPC: { description: 'if true, all JSON-RPC-requests will be logged in the logfile in order to debug', type: 'boolean', example: false } } } } } }

/** validates the USNConfig and returns true | false. if it failes, use validateUSNConfig.errors to get a list of errors. */
export const validateUSNConfig = ajv.compile(validationDef.USNConfig)
export const USNConfigDefinition = validationDef.USNConfig
export function validateUSNConfigAndThrow(data: USNConfig) { validateAndThrow(validateUSNConfig, data) }
// --end-generated--

import { copy } from '../utils/copy'
export const validateFullConfig = ajv.compile(copy(validationDef.USNConfig, {}, true, (path, dst) => {
    if (path.indexOf('.') > 0 && !dst.required && dst.properties)
        dst.required = Object.keys(dst.properties)
    return dst
}))