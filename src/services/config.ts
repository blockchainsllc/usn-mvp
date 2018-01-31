// tslint:disable : no-invalid-this no-empty non-literal-require
/**
 * Configurations-Object
 */

import { USNConfig, validateFullConfig } from '../types/config'

// start with defaults
const config: USNConfig = {
  eth: {
    clients: <string[]>[]
  },
  contracts: {},
  services: {},
  logger: {
    append: false,
    file: 'usn.log',
    level: 'debug',
    colors: true,
    logRPC: false
  },
  configDir: '.'
}

try {
  // tslint:disable-next-line:no-var-requires
  Object.assign(config, require('../../config.json'))
}
catch (ex) {
  throw new Error('Could not read the config-file ' + ex)
}

if (!validateFullConfig(config))
  throw new Error('invalid data in config : '
    + validateFullConfig.errors.map(e => e.dataPath + '(' + e.data + '):' + e.message).join('\n') + '\n' + JSON.stringify(config, null, 2))

export default config
