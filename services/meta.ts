/**
 * Searches for devices
 */
import config from './config'
import axios from 'axios'

export interface MetaHandler {
  canHandle(url: string): boolean
  retrieveJson(url: string): Promise<any>
  storeJson(data: any): Promise<string>
  retrieveImage(url: string): Promise<string>
  storeImage(data: any): Promise<string>
}
// handlers how to resolve a IPFS-Hash
export const ipfsHandlers: MetaHandler[] = []

ipfsHandlers.push({
  canHandle(url: string): boolean {
    return url.startsWith('ipfs://')
  },
  async retrieveJson(url: string): Promise<any> {
    return axios.get(config.services.search + '/meta/hash/' + url.substring(7)).then(_ => _.data)
  },
  async storeJson(data: any): Promise<string> {
    return axios.post(config.services.search + '/meta/hash/', data)
      .then(_ => 'ipfs://' + _.data.hash)
  },
  async retrieveImage(url: string): Promise<string> {
    if (url.startsWith('ipfs://'))
      return config.services.search + '/meta/hash/' + url.substring(7)
    return url
  },
  async storeImage(data: any): Promise<string> {
    return axios.post(
      config.services.search + '/meta/hash/',
      Buffer.isBuffer(data) ? { encoding: 'base64', data: data.toString('base64') } : { encoding: 'base64', data })
      .then(_ => 'ipfs://' + _.data.hash)
  }
})

export async function retrieveJson(url: string): Promise<any> {
  if (!url) return null
  const handler = ipfsHandlers.find(_ => _.canHandle(url))
  if (!handler) throw new Error(url + ' handler not supported')
  return handler.retrieveJson(url)
}

export async function storeJson(data: any): Promise<string> {
  return ipfsHandlers[0].storeJson(data)
}
export async function retrieveImage(url: string): Promise<string> {
  if (!url) return null
  const handler = ipfsHandlers.find(_ => _.canHandle(url))
  if (!handler) throw new Error(url + ' handler not supported')
  return handler.retrieveJson(url)
}

export async function storeImage(data: any): Promise<string> {
  return ipfsHandlers[0].storeJson(data)
}