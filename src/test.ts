import * as usn from './index'

function getNodeId(name: string, root?: string) {
  return name.split('.').reduceRight(
    (r, n) => usn.web3.utils.keccak256(r + usn.web3.utils.keccak256(usn.util.eth.toHex(n)).substring(2)), usn.util.eth.toHex(root || '0x0', 32))

}
function getNameHash(name: string) {
  return usn.web3.utils.keccak256(usn.util.eth.toHex(name))
}

/**
 * deploys the ENS
 */
async function deployENS(owner: string) {

  // deploy the ENS
  const ens = await usn.contracts.ENS.ENSImpl.deploy({ from: owner })

  // registrar for the subdomain
  const registrar = await usn.contracts.ENS.USNRegistrar.deploy(ens.address, getNodeId('tia.eth'), { from: owner })

  // deploy resolver
  const resolver = await usn.contracts.ENS.USNResolver.deploy(ens.address, getNodeId('tia.eth'), { from: owner })

  // set the owner of tia.eth-domain
  await ens.setSubnodeOwner('0x00', getNameHash('eth'), owner, { from: owner })
  await ens.setSubnodeOwner(getNodeId('eth'), getNameHash('tia'), registrar.address, { from: owner })

  // set the resolver
  await registrar.setResolver(resolver.address, { from: owner })

  // store the address in the config
  usn.config.contracts.registry = resolver.address

  // whitelist contract
  await resolver.setWhitelistedCode(usn.contracts.impl.AccessOnly.runtimeBinHash, true, { from: owner })

}

/**
 * deploys and registeres a device.
 * @param url 
 * @param metaIPFS 
 * @param owner 
 * @param additionalUsers 
 */
async function registerAccessDevice(url: string, metaIPFS: string, owner: string, additionalUsers: string[]) {

  // parse the url in order to get the deviceId
  const props = usn.Device.parseURL(url)

  // deploy the contract
  const contract = await usn.Device.createContract(props.contractName, owner, usn.contracts.impl.AccessOnly)

  // register a device
  await contract.setObject(
    props.deviceId,
    usn.util.eth.toHex(metaIPFS),
    usn.util.props.fromDeviceProperties({
      identityRequired: true
    }),
    { from: owner }
  )

  // add access to additional users:
  for (const user of additionalUsers)
    await contract.setAccessWhitelist(props.deviceId, user, true, { from: owner })

  // return the Device-helper-class
  return usn.Device.fromUrl(url)
}

async function runTest(owner: string) {

  // initially deploy the ENS
  await deployENS(owner)

  // now register a device
  const device = await registerAccessDevice('testDevice@tia.eth', 'ipfs://QmULXfLGdVkM2zQug3jVEUGskM8Yvj84bScTYRdbUgCJuB', owner, ['0x1234']).then(d => d.forUser(owner))

  // check if we have access
  if (await device.access.canAccess()) {
    // send a message
    const response = await device.sendActionMessage('turn_on')

    if (response.verified)
      console.log('message received and verified')
    else
      console.log('message received and verified')

  }
  else
    console.log('the user has no access to the device!')

}