/**
 * sends messages to devices
 */
import axios, { AxiosResponse } from 'axios'
import * as registry from './registry'
import config from './config'
import * as messages from '../types/messages'

/**
 * sends a message to a device.
 * 
 * this may be done by any useable protocol, 
 * @param message the message
 */
export async function sendMessage(message: any) {
  if (!config.services.hub) throw new Error('ERRKEY: config_no_hub : no hub-address in the config-file!')
  const response: AxiosResponse = await axios.post(config.services.hub, message).then(_ => _).catch(err => ({
    // tslint:disable-next-line:no-object-literal-type-assertion
    status: 200, statusText: '', headers: undefined, config: undefined, data: <messages.ErrorResponse>{
      msgType: 'error',
      msgId: 0,
      error: 'Error sending the message to the device :' + err.message,
      url: message.url,
      timestamp: Math.round(Date.now() / 1000),
      errkey: 'message_failed',
      args: [err.message]
    }
  }))
  if (response.status !== 200)
    throw new Error('ERRKEY: message_failed : could not deliver message to the device : '
      + JSON.stringify(response.data || response.statusText))
  else if (Array.isArray(response.data)) {
    if (!response.data.length) throw new Error('no response from the device!')
    const deviceMessage = response.data.find(_ => _.msgType)
    const errorMessage = response.data.find(_ => _.error)
    if (deviceMessage && deviceMessage.msgType !== 'error') return deviceMessage

    if (errorMessage) {
      const err: messages.ErrorResponse = response.data[0]
      throw new Error((err.errkey ? `ERRKEY: ${err.errkey} : ` : '') + err.error)
    }

    return response.data[0]
  }
  return response.data

}
