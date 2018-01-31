/* tslint:disable: no-trailing-whitespace whitespace max-line-length no-consensecutive-blank-lines member-ordering function-name no-unused-expression no-consecutive-blank-lines max-classes-per-file */
/**
 * the Solidity contracts.
 *
 * @module contracts
 */

import { ABIDefinition, BlockType, BN, Contract, EventEmitter, EventLog, PromiEvent, TransactionReceipt, Tx } from './types/types.d'
import Web3 from './types/web3'
import * as color from 'cli-color'
import defWeb3 from './services/web3'
import { log } from './utils/logger'

import { formatEvents, validateArguments, validateCallResult } from './utils/validate'

let defTx:Tx = {}

export function setDefaultTx(tx:Tx) { defTx = tx }

export namespace ENS {

/**
 */
export class AbstractENS {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {AbstractENS} the AbstractENS
   *
   */
  static at(address:string, web3?:Web3):AbstractENS {  // tslint:disable-line:function-name
   return new AbstractENS( new (web3||defWeb3).eth.Contract( AbstractENS.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[{name:'_node',type:'bytes32'}],name:'resolver',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'_node',type:'bytes32'}],name:'owner',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'_node',type:'bytes32'},{name:'_label',type:'bytes32'},{name:'_owner',type:'address'}],name:'setSubnodeOwner',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:false,inputs:[{name:'_node',type:'bytes32'},{name:'_ttl',type:'uint64'}],name:'setTTL',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[{name:'_node',type:'bytes32'}],name:'ttl',outputs:[{name:'',type:'uint64'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'_node',type:'bytes32'},{name:'_resolver',type:'address'}],name:'setResolver',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:false,inputs:[{name:'_node',type:'bytes32'},{name:'_owner',type:'address'}],name:'setOwner',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{anonymous:false,inputs:[{indexed:true,name:'_node',type:'bytes32'},{indexed:true,name:'_label',type:'bytes32'},{indexed:false,name:'_owner',type:'address'}],name:'NewOwner',type:'event'},{anonymous:false,inputs:[{indexed:true,name:'_node',type:'bytes32'},{indexed:false,name:'_owner',type:'address'}],name:'Transfer',type:'event'},{anonymous:false,inputs:[{indexed:true,name:'_node',type:'bytes32'},{indexed:false,name:'_resolver',type:'address'}],name:'NewResolver',type:'event'},{anonymous:false,inputs:[{indexed:true,name:'_node',type:'bytes32'},{indexed:false,name:'_ttl',type:'uint64'}],name:'NewTTL',type:'event'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'AbstractENS'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * This is a readonly constant function.
   *
   * @param {string} _node - the node
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  resolver(_node:string):Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AbstractENS.abi[0])
    return this.contract.methods.resolver(...arguments).call().then(_=>validateCallResult(_,AbstractENS.abi[0]))
  }

  /**
   * This is a readonly constant function.
   *
   * @param {string} _node - the node
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  owner(_node:string):Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AbstractENS.abi[1])
    return this.contract.methods.owner(...arguments).call().then(_=>validateCallResult(_,AbstractENS.abi[1]))
  }

  /**
   * This function requries a transaction.
   *
   * @param {string} _node - the node
   * @param {string} _label - the label
   * @param {string} _owner - the owner
   *
   */
  setSubnodeOwner(_node:string, _label:string, _owner:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AbstractENS.abi[2])
    log('debug',color.green('AbstractENS.setSubnodeOwner')+color.blackBright('(_node='+_node+', _label='+_label+', _owner='+_owner+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setSubnodeOwner(_node, _label, _owner).send(txargs||{...defTx})
      .on('error', error=>log('error','AbstractENS.setSubnodeOwner : '+error.message,error))
      .on('transactionHash', txh=>log('debug','AbstractENS.setSubnodeOwner : txhash = '+txh))
      .on('receipt', receipt=>log('debug','AbstractENS.setSubnodeOwner : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This function requries a transaction.
   *
   * @param {string} _node - the node
   * @param {BN|number|string} _ttl - the ttl
   *
   */
  setTTL(_node:string, _ttl:BN|number|string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AbstractENS.abi[3])
    log('debug',color.green('AbstractENS.setTTL')+color.blackBright('(_node='+_node+', _ttl='+_ttl+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setTTL(_node, _ttl).send(txargs||{...defTx})
      .on('error', error=>log('error','AbstractENS.setTTL : '+error.message,error))
      .on('transactionHash', txh=>log('debug','AbstractENS.setTTL : txhash = '+txh))
      .on('receipt', receipt=>log('debug','AbstractENS.setTTL : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This is a readonly constant function.
   *
   * @param {string} _node - the node
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  ttl(_node:string):Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AbstractENS.abi[4])
    return this.contract.methods.ttl(...arguments).call().then(_=>validateCallResult(_,AbstractENS.abi[4]))
  }

  /**
   * This function requries a transaction.
   *
   * @param {string} _node - the node
   * @param {string} _resolver - the resolver
   *
   */
  setResolver(_node:string, _resolver:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AbstractENS.abi[5])
    log('debug',color.green('AbstractENS.setResolver')+color.blackBright('(_node='+_node+', _resolver='+_resolver+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setResolver(_node, _resolver).send(txargs||{...defTx})
      .on('error', error=>log('error','AbstractENS.setResolver : '+error.message,error))
      .on('transactionHash', txh=>log('debug','AbstractENS.setResolver : txhash = '+txh))
      .on('receipt', receipt=>log('debug','AbstractENS.setResolver : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This function requries a transaction.
   *
   * @param {string} _node - the node
   * @param {string} _owner - the owner
   *
   */
  setOwner(_node:string, _owner:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AbstractENS.abi[6])
    log('debug',color.green('AbstractENS.setOwner')+color.blackBright('(_node='+_node+', _owner='+_owner+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setOwner(_node, _owner).send(txargs||{...defTx})
      .on('error', error=>log('error','AbstractENS.setOwner : '+error.message,error))
      .on('transactionHash', txh=>log('debug','AbstractENS.setOwner : txhash = '+txh))
      .on('receipt', receipt=>log('debug','AbstractENS.setOwner : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * subsribes for incoming events.
   *
   * @param {string} _node - the node
   * @param {string} _label - the label
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeNewOwner(options?: { filter?: {_node?:string , _label?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ _node?:string , _label?:string , _owner?:string  }> {
    return this.contract.events.NewOwner(options)
  }

  /**
   * read PastEvents.
   *
   * @param {string} _node - the node
   * @param {string} _label - the label
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getNewOwner(options?: { filter?: {_node?:string , _label?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ _node?:string , _label?:string , _owner?:string  }>[]> {
    return (<any>this.contract).getPastEvents('NewOwner',options)
  }

  /**
   * subsribes for incoming events.
   *
   * @param {string} _node - the node
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeTransfer(options?: { filter?: {_node?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ _node?:string , _owner?:string  }> {
    return this.contract.events.Transfer(options)
  }

  /**
   * read PastEvents.
   *
   * @param {string} _node - the node
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getTransfer(options?: { filter?: {_node?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ _node?:string , _owner?:string  }>[]> {
    return (<any>this.contract).getPastEvents('Transfer',options)
  }

  /**
   * subsribes for incoming events.
   *
   * @param {string} _node - the node
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeNewResolver(options?: { filter?: {_node?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ _node?:string , _resolver?:string  }> {
    return this.contract.events.NewResolver(options)
  }

  /**
   * read PastEvents.
   *
   * @param {string} _node - the node
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getNewResolver(options?: { filter?: {_node?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ _node?:string , _resolver?:string  }>[]> {
    return (<any>this.contract).getPastEvents('NewResolver',options)
  }

  /**
   * subsribes for incoming events.
   *
   * @param {string} _node - the node
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeNewTTL(options?: { filter?: {_node?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ _node?:string , _ttl?:BN|number|string  }> {
    return this.contract.events.NewTTL(options)
  }

  /**
   * read PastEvents.
   *
   * @param {string} _node - the node
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getNewTTL(options?: { filter?: {_node?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ _node?:string , _ttl?:BN|number|string  }>[]> {
    return (<any>this.contract).getPastEvents('NewTTL',options)
  }

  subscribeAllEvents(options?: { filter?: any, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter {
    return this.contract.events.allEvents(options)
  }

  getAllEvents(options?: { filter?: any, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): Promise<EventLog[]> {
    return (<any>this.contract).getPastEvents('allEvents',options)
  }

}

}



export namespace ENS {

/**
 */
export class ENSImpl extends ENS.AbstractENS {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return [AbstractENS]
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {ENSImpl} the ENSImpl
   *
   */
  static at(address:string, web3?:Web3):ENSImpl {  // tslint:disable-line:function-name
   return new ENSImpl( new (web3||defWeb3).eth.Contract( ENSImpl.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[{name:'_node',type:'bytes32'}],name:'resolver',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'_node',type:'bytes32'}],name:'owner',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'_node',type:'bytes32'},{name:'_label',type:'bytes32'},{name:'_owner',type:'address'}],name:'setSubnodeOwner',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:false,inputs:[{name:'_node',type:'bytes32'},{name:'_ttl',type:'uint64'}],name:'setTTL',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[{name:'_node',type:'bytes32'}],name:'ttl',outputs:[{name:'',type:'uint64'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'_node',type:'bytes32'},{name:'_resolver',type:'address'}],name:'setResolver',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:false,inputs:[{name:'_node',type:'bytes32'},{name:'_owner',type:'address'}],name:'setOwner',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{inputs:[],payable:false,stateMutability:'nonpayable',type:'constructor'},{anonymous:false,inputs:[{indexed:true,name:'_node',type:'bytes32'},{indexed:true,name:'_label',type:'bytes32'},{indexed:false,name:'_owner',type:'address'}],name:'NewOwner',type:'event'},{anonymous:false,inputs:[{indexed:true,name:'_node',type:'bytes32'},{indexed:false,name:'_owner',type:'address'}],name:'Transfer',type:'event'},{anonymous:false,inputs:[{indexed:true,name:'_node',type:'bytes32'},{indexed:false,name:'_resolver',type:'address'}],name:'NewResolver',type:'event'},{anonymous:false,inputs:[{indexed:true,name:'_node',type:'bytes32'},{indexed:false,name:'_ttl',type:'uint64'}],name:'NewTTL',type:'event'}]
  }

  /**
   * get the bytecode of a Contract 
   *
   * @returns {string} the bytecode
   *
   */
  static get bin():string {
    return '0x6060604052341561000f57600080fd5b60008080526020527fad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb58054600160a060020a033316600160a060020a0319909116179055610501806100626000396000f300606060405236156100805763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416630178b8bf811461008557806302571be3146100b757806306ab5923146100cd57806314ab9038146100f457806316a25cbd146101175780631896f70a1461014a5780635b0fc9c31461016c575b600080fd5b341561009057600080fd5b61009b60043561018e565b604051600160a060020a03909116815260200160405180910390f35b34156100c257600080fd5b61009b6004356101ac565b34156100d857600080fd5b6100f2600435602435600160a060020a03604435166101c7565b005b34156100ff57600080fd5b6100f260043567ffffffffffffffff60243516610289565b341561012257600080fd5b61012d600435610355565b60405167ffffffffffffffff909116815260200160405180910390f35b341561015557600080fd5b6100f2600435600160a060020a036024351661038c565b341561017757600080fd5b6100f2600435600160a060020a0360243516610432565b600090815260208190526040902060010154600160a060020a031690565b600090815260208190526040902054600160a060020a031690565b600083815260208190526040812054849033600160a060020a039081169116146101f057600080fd5b8484604051918252602082015260409081019051908190039020915083857fce0457fe73731f824cc272376169235128c118b49d344817417c6d108d155e8285604051600160a060020a03909116815260200160405180910390a3506000908152602081905260409020805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a03929092169190911790555050565b600082815260208190526040902054829033600160a060020a039081169116146102b257600080fd5b827f1d4f9bbfc9cab89d66e1a1562f2233ccbf1308cb4f63de2ead5787adddb8fa688360405167ffffffffffffffff909116815260200160405180910390a250600091825260208290526040909120600101805467ffffffffffffffff90921674010000000000000000000000000000000000000000027fffffffff0000000000000000ffffffffffffffffffffffffffffffffffffffff909216919091179055565b60009081526020819052604090206001015474010000000000000000000000000000000000000000900467ffffffffffffffff1690565b600082815260208190526040902054829033600160a060020a039081169116146103b557600080fd5b827f335721b01866dc23fbee8b6b2c7b1e14d6f05c28cd35a2c934239f94095602a083604051600160a060020a03909116815260200160405180910390a250600091825260208290526040909120600101805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a03909216919091179055565b600082815260208190526040902054829033600160a060020a0390811691161461045b57600080fd5b827fd4735d920b0f87494915f556dd9b54c8f309026070caea5c737245152564d26683604051600160a060020a03909116815260200160405180910390a250600091825260208290526040909120805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a039092169190911790555600a165627a7a72305820ab8a868b5290b28a6c19ce7f08731dc130f3147c1b4c9feb42c3cc794d0d10ad0029'  //  tslint:disable-line:max-line-length
  }

  /**
   * get the hash of the runtime-bin of a Contract 
   *
   * @returns {string} the hash of the runtime bytecode
   *
   */
  static get runtimeBinHash():string {
    return '0x761a003c92c14484520cb46e136d0fe6e7be25df5ff455294aaed49b9a0c6c91'  //  tslint:disable-line:max-line-length
  }

  /**
   * get the hash of the runtime-bin of a Contract 
   *
   * @returns {string} the hash of the runtime bytecode
   *
   */
  static is(address:string):Promise<boolean> {
    return defWeb3.eth.getCode(address).then(_=>defWeb3.utils.sha3(_)===ENSImpl.runtimeBinHash)  //  tslint:disable-line:max-line-length
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    super(contract)
    this.contract = contract
  }

  contract: Contract

/**
 * deploy a new Contract
 *
 * @param {any} web3 - a optional web3-object
 * @param {Function} receiptCallback - a optional callBack, this will inform you of the receipt.
 * @returns {Promise<ENSImpl>} a Promise for the deployed contract.
 *
 */
 static deploy(tx?:Tx,web3?:Web3,receiptCallback?:(receipt:TransactionReceipt)=>any):Promise<ENSImpl> {      // eslint-disable-line no-unused-vars
    const args = Array.prototype.slice.call(arguments)
    args.length && typeof(args[args.length-1])==='function' && args.pop()
    args.length && args[args.length-1] && args[args.length-1].eth && args.pop()
    args.length && typeof(args[args.length-1])==='object' && args.pop()
    const txo = new (web3||defWeb3).eth.Contract(ENSImpl.abi).deploy({data:ENSImpl.bin, arguments:args})
    txo.arguments = args
    log('debug',color.green('deploy ENSImpl')+color.blackBright(' with ('+args.join()+')'))
    return txo.send(tx||{...defTx})
      .on('error', error=>log('error','deploy ENSImpl : '+error.message,error))
      .on('transactionHash', h=>log('debug','deploy ENSImpl : txhash = '+h))
      .on('receipt', receipt=>log('debug','deploy ENSImpl : confirmed. address = '+receipt.contractAddress+' gasUsed = '+receipt.gasUsed))
      .on('receipt', receipt=> receiptCallback && receiptCallback(receipt))
      .then(_=>new ENSImpl(_)) 
  }

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'ENSImpl'
  }

}

}



export namespace ENS {

/**
 * interface used to check for the owner of given ENS-Nodeid
 *
 */
export class ENSOwner {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {ENSOwner} the ENSOwner
   *
   */
  static at(address:string, web3?:Web3):ENSOwner {  // tslint:disable-line:function-name
   return new ENSOwner( new (web3||defWeb3).eth.Contract( ENSOwner.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[],name:'ens',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'_nodeId',type:'bytes32'}],name:'getENSOwner',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'},{inputs:[{name:'_ens',type:'address'}],payable:false,stateMutability:'nonpayable',type:'constructor'}]
  }

  /**
   * get the bytecode of a Contract 
   *
   * @returns {string} the bytecode
   *
   */
  static get bin():string {
    return '0x6060604052341561000f57600080fd5b6040516020806101cc8339810160405280805160008054600160a060020a03909216600160a060020a03199092169190911790555050610178806100546000396000f300606060405263ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416633f15457f8114610047578063a8ef9c461461008357600080fd5b341561005257600080fd5b61005a610099565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200160405180910390f35b341561008e57600080fd5b61005a6004356100b5565b60005473ffffffffffffffffffffffffffffffffffffffff1681565b6000805473ffffffffffffffffffffffffffffffffffffffff166302571be38383604051602001526040517c010000000000000000000000000000000000000000000000000000000063ffffffff84160281526004810191909152602401602060405180830381600087803b151561012c57600080fd5b6102c65a03f1151561013d57600080fd5b505050604051805193925050505600a165627a7a72305820decd0f790887203317b690caffd83e7bf4dab4aad9dae00c56f4cffa8046e6e50029'  //  tslint:disable-line:max-line-length
  }

  /**
   * get the hash of the runtime-bin of a Contract 
   *
   * @returns {string} the hash of the runtime bytecode
   *
   */
  static get runtimeBinHash():string {
    return '0xf1c2030533c42877ea59e959f751986f3cae8e844210098135b985615e26d7bf'  //  tslint:disable-line:max-line-length
  }

  /**
   * get the hash of the runtime-bin of a Contract 
   *
   * @returns {string} the hash of the runtime bytecode
   *
   */
  static is(address:string):Promise<boolean> {
    return defWeb3.eth.getCode(address).then(_=>defWeb3.utils.sha3(_)===ENSOwner.runtimeBinHash)  //  tslint:disable-line:max-line-length
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

/**
 * interface used to check for the owner of given ENS-Nodeid
 *
 * deploy a new Contract
 *
 * @param {any} web3 - a optional web3-object
 * @param {Function} receiptCallback - a optional callBack, this will inform you of the receipt.
 * @returns {Promise<ENSOwner>} a Promise for the deployed contract.
 *
 * @param {string} _ens - the ens
 *
 */
 static deploy(_ens, tx?:Tx,web3?:Web3,receiptCallback?:(receipt:TransactionReceipt)=>any):Promise<ENSOwner> {      // eslint-disable-line no-unused-vars
    const args = Array.prototype.slice.call(arguments)
    args.length && typeof(args[args.length-1])==='function' && args.pop()
    args.length && args[args.length-1] && args[args.length-1].eth && args.pop()
    args.length && typeof(args[args.length-1])==='object' && args.pop()
    const txo = new (web3||defWeb3).eth.Contract(ENSOwner.abi).deploy({data:ENSOwner.bin, arguments:args})
    txo.arguments = args
    log('debug',color.green('deploy ENSOwner')+color.blackBright(' with ('+args.join()+')'))
    return txo.send(tx||{...defTx})
      .on('error', error=>log('error','deploy ENSOwner : '+error.message,error))
      .on('transactionHash', h=>log('debug','deploy ENSOwner : txhash = '+h))
      .on('receipt', receipt=>log('debug','deploy ENSOwner : confirmed. address = '+receipt.contractAddress+' gasUsed = '+receipt.gasUsed))
      .on('receipt', receipt=> receiptCallback && receiptCallback(receipt))
      .then(_=>new ENSOwner(_)) 
  }

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'ENSOwner'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ens():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,ENSOwner.abi[0])
    return this.contract.methods.ens(...arguments).call().then(_=>validateCallResult(_,ENSOwner.abi[0]))
  }

  /**
   * This is a readonly constant function.
   *
   * @param {string} _nodeId - the nodeId
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  getENSOwner(_nodeId:string):Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,ENSOwner.abi[1])
    return this.contract.methods.getENSOwner(...arguments).call().then(_=>validateCallResult(_,ENSOwner.abi[1]))
  }

}

}



export namespace interfaces {

/**
 */
export class Owned {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {Owned} the Owned
   *
   */
  static at(address:string, web3?:Web3):Owned {  // tslint:disable-line:function-name
   return new Owned( new (web3||defWeb3).eth.Contract( Owned.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[],name:'owner',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'_newOwner',type:'address'}],name:'changeOwner',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{inputs:[],payable:false,stateMutability:'nonpayable',type:'constructor'},{anonymous:false,inputs:[{indexed:false,name:'_newOwner',type:'address'}],name:'LogChangeOwner',type:'event'}]
  }

  /**
   * get the bytecode of a Contract 
   *
   * @returns {string} the bytecode
   *
   */
  static get bin():string {
    return '0x6060604052341561000f57600080fd5b60008054600160a060020a033316600160a060020a03199091161790556101558061003b6000396000f300606060405263ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416638da5cb5b8114610047578063a6f9dae11461007657600080fd5b341561005257600080fd5b61005a610097565b604051600160a060020a03909116815260200160405180910390f35b341561008157600080fd5b610095600160a060020a03600435166100a6565b005b600054600160a060020a031681565b60005433600160a060020a039081169116146100c157600080fd5b6000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0383161790557f95fd54179c11867fb083dd94347ea50f144dd4cfd7612b7bca169f162824af1681604051600160a060020a03909116815260200160405180910390a1505600a165627a7a723058203e7997d0079f22bba423b01ef2f2716867da1d1e68146e8bf40ed108a1b0f5660029'  //  tslint:disable-line:max-line-length
  }

  /**
   * get the hash of the runtime-bin of a Contract 
   *
   * @returns {string} the hash of the runtime bytecode
   *
   */
  static get runtimeBinHash():string {
    return '0xde91052f8d15b6b6e11dc9a43f0f03b8a1cbecb421a83a732f599636110789a8'  //  tslint:disable-line:max-line-length
  }

  /**
   * get the hash of the runtime-bin of a Contract 
   *
   * @returns {string} the hash of the runtime bytecode
   *
   */
  static is(address:string):Promise<boolean> {
    return defWeb3.eth.getCode(address).then(_=>defWeb3.utils.sha3(_)===Owned.runtimeBinHash)  //  tslint:disable-line:max-line-length
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'Owned'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  owner():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,Owned.abi[0])
    return this.contract.methods.owner(...arguments).call().then(_=>validateCallResult(_,Owned.abi[0]))
  }

  /**
   * `owner` can step down and assign some other address to this role
   *
   * This function requries a transaction.
   *
   * @param {string} _newOwner - The address of the new owner. 0x0 can be used to create  an unowned neutral vault, however that cannot be undone
   *
   */
  changeOwner(_newOwner:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,Owned.abi[1])
    log('debug',color.green('Owned.changeOwner')+color.blackBright('(_newOwner='+_newOwner+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.changeOwner(_newOwner).send(txargs||{...defTx})
      .on('error', error=>log('error','Owned.changeOwner : '+error.message,error))
      .on('transactionHash', txh=>log('debug','Owned.changeOwner : txhash = '+txh))
      .on('receipt', receipt=>log('debug','Owned.changeOwner : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * subsribes for incoming events.
   *
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeLogChangeOwner(options?: { filter?: {}, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ _newOwner?:string  }> {
    return this.contract.events.LogChangeOwner(options)
  }

  /**
   * read PastEvents.
   *
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getLogChangeOwner(options?: { filter?: {}, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ _newOwner?:string  }>[]> {
    return (<any>this.contract).getPastEvents('LogChangeOwner',options)
  }

  subscribeAllEvents(options?: { filter?: any, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter {
    return this.contract.events.allEvents(options)
  }

  getAllEvents(options?: { filter?: any, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): Promise<EventLog[]> {
    return (<any>this.contract).getPastEvents('allEvents',options)
  }

}

}



export namespace ENS {

/**
 * this contract may be used to register new names for the usn-domain.
 *
 */
export class USNRegistrar extends interfaces.Owned {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return [interfaces.Owned]
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {USNRegistrar} the USNRegistrar
   *
   */
  static at(address:string, web3?:Web3):USNRegistrar {  // tslint:disable-line:function-name
   return new USNRegistrar( new (web3||defWeb3).eth.Contract( USNRegistrar.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[],name:'difficulty',outputs:[{name:'',type:'uint256'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'ens',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'resolver',type:'address'}],name:'setResolver',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:false,inputs:[{name:'_newRegistrar',type:'address'}],name:'updateRegistrar',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:false,inputs:[{name:'val',type:'uint256'}],name:'setDifficulty',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:false,inputs:[{name:'_subnode',type:'bytes32'},{name:'_owner',type:'address'}],name:'registerObject',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:false,inputs:[{name:'_admin',type:'address'}],name:'setAdmin',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[],name:'owner',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'_newOwner',type:'address'}],name:'changeOwner',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[],name:'rootNode',outputs:[{name:'',type:'bytes32'}],payable:false,stateMutability:'view',type:'function'},{inputs:[{name:'_ens',type:'address'},{name:'_rootNode',type:'bytes32'}],payable:false,stateMutability:'nonpayable',type:'constructor'},{payable:false,stateMutability:'nonpayable',type:'fallback'},{anonymous:false,inputs:[{indexed:false,name:'_newOwner',type:'address'}],name:'LogChangeOwner',type:'event'}]
  }

  /**
   * get the bytecode of a Contract 
   *
   * @returns {string} the bytecode
   *
   */
  static get bin():string {
    return '0x6060604052341561000f57600080fd5b60405160408061060a833981016040528080519190602001805160008054600160a060020a03338116600160a060020a031992831617928390556001805497821697831697909717909655600292909255600380549092169416939093179092555050600160f060020a0360045561057e8061008c6000396000f300606060405236156100885763ffffffff60e060020a60003504166319cae46281146100985780633f15457f146100bd5780634e543b26146100ec578063592b700a1461010d578063602512e11461012c5780636c4013f714610142578063704b6c02146101645780638da5cb5b14610183578063a6f9dae114610196578063faff50a8146101b5575b341561009357600080fd5b600080fd5b34156100a357600080fd5b6100ab6101c8565b60405190815260200160405180910390f35b34156100c857600080fd5b6100d06101ce565b604051600160a060020a03909116815260200160405180910390f35b34156100f757600080fd5b61010b600160a060020a03600435166101dd565b005b341561011857600080fd5b61010b600160a060020a036004351661026c565b341561013757600080fd5b61010b6004356102e4565b341561014d57600080fd5b61010b600435600160a060020a0360243516610304565b341561016f57600080fd5b61010b600160a060020a0360043516610470565b341561018e57600080fd5b6100d06104ba565b34156101a157600080fd5b61010b600160a060020a03600435166104c9565b34156101c057600080fd5b6100ab61054c565b60045481565b600154600160a060020a031681565b60005433600160a060020a039081169116146101f857600080fd5b600154600254600160a060020a0390911690631896f70a908360405160e060020a63ffffffff85160281526004810192909252600160a060020a03166024820152604401600060405180830381600087803b151561025557600080fd5b6102c65a03f1151561026657600080fd5b50505050565b60005433600160a060020a0390811691161461028757600080fd5b600154600254600160a060020a0390911690635b0fc9c3908360405160e060020a63ffffffff85160281526004810192909252600160a060020a03166024820152604401600060405180830381600087803b151561025557600080fd5b60005433600160a060020a039081169116146102ff57600080fd5b600455565b6004546000908190841080610327575060035433600160a060020a039081169116145b151561033257600080fd5b60025484604051918252602082015260409081019051908190039020600154909250600160a060020a03166302571be38360006040516020015260405160e060020a63ffffffff84160281526004810191909152602401602060405180830381600087803b15156103a257600080fd5b6102c65a03f115156103b357600080fd5b5050506040518051915050600160a060020a03811615806103e5575033600160a060020a031681600160a060020a0316145b15156103f057600080fd5b600154600254600160a060020a03909116906306ab592390868660405160e060020a63ffffffff861602815260048101939093526024830191909152600160a060020a03166044820152606401600060405180830381600087803b151561045657600080fd5b6102c65a03f1151561046757600080fd5b50505050505050565b60005433600160a060020a0390811691161461048b57600080fd5b6003805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0392909216919091179055565b600054600160a060020a031681565b60005433600160a060020a039081169116146104e457600080fd5b6000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0383161790557f95fd54179c11867fb083dd94347ea50f144dd4cfd7612b7bca169f162824af1681604051600160a060020a03909116815260200160405180910390a150565b600254815600a165627a7a72305820af50890765bd0cc89936306e8efbe9badf3d3ada3ff2466e4af83d266c58e2850029'  //  tslint:disable-line:max-line-length
  }

  /**
   * get the hash of the runtime-bin of a Contract 
   *
   * @returns {string} the hash of the runtime bytecode
   *
   */
  static get runtimeBinHash():string {
    return '0x693ff46712314154cab4ad54076b8aa0b6c96edfb0e6291266e0d7a56b731440'  //  tslint:disable-line:max-line-length
  }

  /**
   * get the hash of the runtime-bin of a Contract 
   *
   * @returns {string} the hash of the runtime bytecode
   *
   */
  static is(address:string):Promise<boolean> {
    return defWeb3.eth.getCode(address).then(_=>defWeb3.utils.sha3(_)===USNRegistrar.runtimeBinHash)  //  tslint:disable-line:max-line-length
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    super(contract)
    this.contract = contract
  }

  contract: Contract

/**
 * this contract may be used to register new names for the usn-domain.
 *
 * deploy a new Contract
 *
 * @param {any} web3 - a optional web3-object
 * @param {Function} receiptCallback - a optional callBack, this will inform you of the receipt.
 * @returns {Promise<USNRegistrar>} a Promise for the deployed contract.
 *
 * @param {string} _ens - the ens
 * @param {string} _rootNode - the rootNode
 *
 */
 static deploy(_ens, _rootNode, tx?:Tx,web3?:Web3,receiptCallback?:(receipt:TransactionReceipt)=>any):Promise<USNRegistrar> {      // eslint-disable-line no-unused-vars
    const args = Array.prototype.slice.call(arguments)
    args.length && typeof(args[args.length-1])==='function' && args.pop()
    args.length && args[args.length-1] && args[args.length-1].eth && args.pop()
    args.length && typeof(args[args.length-1])==='object' && args.pop()
    const txo = new (web3||defWeb3).eth.Contract(USNRegistrar.abi).deploy({data:USNRegistrar.bin, arguments:args})
    txo.arguments = args
    log('debug',color.green('deploy USNRegistrar')+color.blackBright(' with ('+args.join()+')'))
    return txo.send(tx||{...defTx})
      .on('error', error=>log('error','deploy USNRegistrar : '+error.message,error))
      .on('transactionHash', h=>log('debug','deploy USNRegistrar : txhash = '+h))
      .on('receipt', receipt=>log('debug','deploy USNRegistrar : confirmed. address = '+receipt.contractAddress+' gasUsed = '+receipt.gasUsed))
      .on('receipt', receipt=> receiptCallback && receiptCallback(receipt))
      .then(_=>new USNRegistrar(_)) 
  }

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'USNRegistrar'
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  difficulty():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNRegistrar.abi[0])
    return this.contract.methods.difficulty(...arguments).call().then(_=>validateCallResult(_,USNRegistrar.abi[0]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ens():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNRegistrar.abi[1])
    return this.contract.methods.ens(...arguments).call().then(_=>validateCallResult(_,USNRegistrar.abi[1]))
  }

  /**
   * This function requries a transaction.
   *
   * @param {string} resolver - the resolver
   *
   */
  setResolver(resolver:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNRegistrar.abi[2])
    log('debug',color.green('USNRegistrar.setResolver')+color.blackBright('(resolver='+resolver+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setResolver(resolver).send(txargs||{...defTx})
      .on('error', error=>log('error','USNRegistrar.setResolver : '+error.message,error))
      .on('transactionHash', txh=>log('debug','USNRegistrar.setResolver : txhash = '+txh))
      .on('receipt', receipt=>log('debug','USNRegistrar.setResolver : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This function requries a transaction.
   *
   * @param {string} _newRegistrar - the newRegistrar
   *
   */
  updateRegistrar(_newRegistrar:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNRegistrar.abi[3])
    log('debug',color.green('USNRegistrar.updateRegistrar')+color.blackBright('(_newRegistrar='+_newRegistrar+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.updateRegistrar(_newRegistrar).send(txargs||{...defTx})
      .on('error', error=>log('error','USNRegistrar.updateRegistrar : '+error.message,error))
      .on('transactionHash', txh=>log('debug','USNRegistrar.updateRegistrar : txhash = '+txh))
      .on('receipt', receipt=>log('debug','USNRegistrar.updateRegistrar : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This function requries a transaction.
   *
   * @param {BN|number|string} val - the val
   *
   */
  setDifficulty(val:BN|number|string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNRegistrar.abi[4])
    log('debug',color.green('USNRegistrar.setDifficulty')+color.blackBright('(val='+val+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setDifficulty(val).send(txargs||{...defTx})
      .on('error', error=>log('error','USNRegistrar.setDifficulty : '+error.message,error))
      .on('transactionHash', txh=>log('debug','USNRegistrar.setDifficulty : txhash = '+txh))
      .on('receipt', receipt=>log('debug','USNRegistrar.setDifficulty : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This function requries a transaction.
   *
   * @param {string} _subnode - the subnode
   * @param {string} _owner - the owner
   *
   */
  registerObject(_subnode:string, _owner:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNRegistrar.abi[5])
    log('debug',color.green('USNRegistrar.registerObject')+color.blackBright('(_subnode='+_subnode+', _owner='+_owner+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.registerObject(_subnode, _owner).send(txargs||{...defTx})
      .on('error', error=>log('error','USNRegistrar.registerObject : '+error.message,error))
      .on('transactionHash', txh=>log('debug','USNRegistrar.registerObject : txhash = '+txh))
      .on('receipt', receipt=>log('debug','USNRegistrar.registerObject : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This function requries a transaction.
   *
   * @param {string} _admin - the admin
   *
   */
  setAdmin(_admin:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNRegistrar.abi[6])
    log('debug',color.green('USNRegistrar.setAdmin')+color.blackBright('(_admin='+_admin+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setAdmin(_admin).send(txargs||{...defTx})
      .on('error', error=>log('error','USNRegistrar.setAdmin : '+error.message,error))
      .on('transactionHash', txh=>log('debug','USNRegistrar.setAdmin : txhash = '+txh))
      .on('receipt', receipt=>log('debug','USNRegistrar.setAdmin : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  rootNode():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNRegistrar.abi[9])
    return this.contract.methods.rootNode(...arguments).call().then(_=>validateCallResult(_,USNRegistrar.abi[9]))
  }

}

}



export namespace ENS {

/**
 */
export class USNResolvable {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {USNResolvable} the USNResolvable
   *
   */
  static at(address:string, web3?:Web3):USNResolvable {  // tslint:disable-line:function-name
   return new USNResolvable( new (web3||defWeb3).eth.Contract( USNResolvable.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[],name:'ens',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'rootNode',outputs:[{name:'',type:'bytes32'}],payable:false,stateMutability:'view',type:'function'}]
  }

  /**
   * get the bytecode of a Contract 
   *
   * @returns {string} the bytecode
   *
   */
  static get bin():string {
    return '0x6060604052341561000f57600080fd5b60ee8061001d6000396000f300606060405263ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416633f15457f81146045578063faff50a814607e57600080fd5b3415604f57600080fd5b605560a0565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200160405180910390f35b3415608857600080fd5b608e60bc565b60405190815260200160405180910390f35b60005473ffffffffffffffffffffffffffffffffffffffff1681565b600154815600a165627a7a72305820af4a228ce22d8ab26ff2a3caeb2d506f3423fe3f2c63c1a8421817420644ea910029'  //  tslint:disable-line:max-line-length
  }

  /**
   * get the hash of the runtime-bin of a Contract 
   *
   * @returns {string} the hash of the runtime bytecode
   *
   */
  static get runtimeBinHash():string {
    return '0xced65a70187b8b5b218e38aa77a3d4bf34aae07cb42233f07f66347633753964'  //  tslint:disable-line:max-line-length
  }

  /**
   * get the hash of the runtime-bin of a Contract 
   *
   * @returns {string} the hash of the runtime bytecode
   *
   */
  static is(address:string):Promise<boolean> {
    return defWeb3.eth.getCode(address).then(_=>defWeb3.utils.sha3(_)===USNResolvable.runtimeBinHash)  //  tslint:disable-line:max-line-length
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

/**
 * deploy a new Contract
 *
 * @param {any} web3 - a optional web3-object
 * @param {Function} receiptCallback - a optional callBack, this will inform you of the receipt.
 * @returns {Promise<USNResolvable>} a Promise for the deployed contract.
 *
 */
 static deploy(tx?:Tx,web3?:Web3,receiptCallback?:(receipt:TransactionReceipt)=>any):Promise<USNResolvable> {      // eslint-disable-line no-unused-vars
    const args = Array.prototype.slice.call(arguments)
    args.length && typeof(args[args.length-1])==='function' && args.pop()
    args.length && args[args.length-1] && args[args.length-1].eth && args.pop()
    args.length && typeof(args[args.length-1])==='object' && args.pop()
    const txo = new (web3||defWeb3).eth.Contract(USNResolvable.abi).deploy({data:USNResolvable.bin, arguments:args})
    txo.arguments = args
    log('debug',color.green('deploy USNResolvable')+color.blackBright(' with ('+args.join()+')'))
    return txo.send(tx||{...defTx})
      .on('error', error=>log('error','deploy USNResolvable : '+error.message,error))
      .on('transactionHash', h=>log('debug','deploy USNResolvable : txhash = '+h))
      .on('receipt', receipt=>log('debug','deploy USNResolvable : confirmed. address = '+receipt.contractAddress+' gasUsed = '+receipt.gasUsed))
      .on('receipt', receipt=> receiptCallback && receiptCallback(receipt))
      .then(_=>new USNResolvable(_)) 
  }

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'USNResolvable'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ens():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNResolvable.abi[0])
    return this.contract.methods.ens(...arguments).call().then(_=>validateCallResult(_,USNResolvable.abi[0]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  rootNode():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNResolvable.abi[1])
    return this.contract.methods.rootNode(...arguments).call().then(_=>validateCallResult(_,USNResolvable.abi[1]))
  }

}

}



export namespace ENS {

/**
 * the main regstry for all contracts based on the USN-Names
 *
 */
export class USNResolver extends interfaces.Owned {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return [interfaces.Owned]
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {USNResolver} the USNResolver
   *
   */
  static at(address:string, web3?:Web3):USNResolver {  // tslint:disable-line:function-name
   return new USNResolver( new (web3||defWeb3).eth.Contract( USNResolver.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[{name:'_interfaceID',type:'bytes4'}],name:'supportsInterface',outputs:[{name:'',type:'bool'}],payable:false,stateMutability:'pure',type:'function'},{constant:true,inputs:[{name:'_addr',type:'address'}],name:'getCodeAt',outputs:[{name:'o_code',type:'bytes'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'_address',type:'address'}],name:'isWhitelisted',outputs:[{name:'',type:'bool'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'_nodeID',type:'bytes32'}],name:'addr',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'ens',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'_codeHash',type:'bytes32'},{name:'_allow',type:'bool'}],name:'setWhitelistedCode',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:false,inputs:[{name:'_subnode',type:'bytes32'},{name:'_newAddress',type:'address'},{name:'_chainIPFS',type:'bytes32'}],name:'setAddressInChain',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[{name:'',type:'bytes32'}],name:'chain',outputs:[{name:'',type:'bytes32'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'_id',type:'bytes4'},{name:'_lib',type:'address'}],name:'setLib',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[],name:'owner',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'_address',type:'address'},{name:'_allow',type:'bool'}],name:'setWhitelisted',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:false,inputs:[{name:'_newOwner',type:'address'}],name:'changeOwner',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[{name:'',type:'bytes32'}],name:'whitelist',outputs:[{name:'',type:'bool'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'',type:'bytes32'}],name:'objects',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'_subnode',type:'bytes32'},{name:'newContract',type:'address'}],name:'setAddress',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[{name:'',type:'bytes4'}],name:'lib',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'rootNode',outputs:[{name:'',type:'bytes32'}],payable:false,stateMutability:'view',type:'function'},{inputs:[{name:'_ens',type:'address'},{name:'_rootNode',type:'bytes32'}],payable:false,stateMutability:'nonpayable',type:'constructor'},{payable:false,stateMutability:'nonpayable',type:'fallback'},{anonymous:false,inputs:[{indexed:false,name:'_type',type:'bytes32'},{indexed:false,name:'_allowed',type:'bool'}],name:'LogWhiteListUpdated',type:'event'},{anonymous:false,inputs:[{indexed:false,name:'_type',type:'bytes4'},{indexed:false,name:'newAddress',type:'address'}],name:'LogLibUpdated',type:'event'},{anonymous:false,inputs:[{indexed:false,name:'_nodeID',type:'bytes32'}],name:'LogAddedObject',type:'event'},{anonymous:false,inputs:[{indexed:false,name:'_nodeID',type:'bytes32'}],name:'LogRemovedObject',type:'event'},{anonymous:false,inputs:[{indexed:true,name:'node',type:'bytes32'},{indexed:false,name:'a',type:'address'}],name:'AddrChanged',type:'event'},{anonymous:false,inputs:[{indexed:false,name:'_newOwner',type:'address'}],name:'LogChangeOwner',type:'event'}]
  }

  /**
   * get the bytecode of a Contract 
   *
   * @returns {string} the bytecode
   *
   */
  static get bin():string {
    return '0x6060604052341561000f57600080fd5b604051604080610b28833981016040528080519190602001805160008054600160a060020a03338116600160a060020a03199283161790925560018054969092169516949094179093555050600255610abb8061006d6000396000f300606060405236156100d55763ffffffff60e060020a60003504166301ffc9a781146100e55780632ca8a0a5146101195780633af32abf146101af5780633b3b57de146101ce5780633f15457f146102005780635229b0f8146102135780635ebd7bfc146102305780636a8b8a6014610255578063775e07ba1461027d5780638da5cb5b146102a95780639281aa0b146102bc578063a6f9dae1146102e0578063afb40c8e146102ff578063b4b27a5614610315578063ca446dd91461032b578063ec17c4851461034d578063faff50a81461036d575b34156100e057600080fd5b600080fd5b34156100f057600080fd5b610105600160e060020a031960043516610380565b604051901515815260200160405180910390f35b341561012457600080fd5b610138600160a060020a03600435166103af565b60405160208082528190810183818151815260200191508051906020019080838360005b8381101561017457808201518382015260200161015c565b50505050905090810190601f1680156101a15780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156101ba57600080fd5b610105600160a060020a03600435166103dd565b34156101d957600080fd5b6101e4600435610462565b604051600160a060020a03909116815260200160405180910390f35b341561020b57600080fd5b6101e4610493565b341561021e57600080fd5b61022e60043560243515156104a2565b005b341561023b57600080fd5b61022e600435600160a060020a036024351660443561051a565b341561026057600080fd5b61026b6004356105dd565b60405190815260200160405180910390f35b341561028857600080fd5b61022e600160e060020a031960043516600160a060020a03602435166105ef565b34156102b457600080fd5b6101e461069e565b34156102c757600080fd5b61022e600160a060020a036004351660243515156106ad565b34156102eb57600080fd5b61022e600160a060020a036004351661078f565b341561030a57600080fd5b610105600435610812565b341561032057600080fd5b6101e4600435610827565b341561033657600080fd5b61022e600435600160a060020a0360243516610842565b341561035857600080fd5b6101e4600160e060020a031960043516610a5c565b341561037857600080fd5b61026b610a77565b600160e060020a0319167f3b3b57de000000000000000000000000000000000000000000000000000000001490565b6103b7610a7d565b813b604051603f8201601f19168101604052818152915080600060208401853c50919050565b6000600360006103ec846103af565b6040518082805190602001908083835b6020831061041b5780518252601f1990920191602091820191016103fc565b6001836020036101000a0380198251168184511617909252505050919091019250604091505051908190039020815260208101919091526040016000205460ff1692915050565b600254600090821461048b57600082815260046020526040902054600160a060020a031661048d565b305b92915050565b600154600160a060020a031681565b60005433600160a060020a039081169116146104bd57600080fd5b60008281526003602052604090819020805460ff19168315151790557f8ab93b47bc41b2cb906046eae77cda278331ee4e7a8cc8e8f5eb1f159a33be44908390839051918252151560208201526040908101905180910390a15050565b6000805433600160a060020a0390811691161461053657600080fd5b600254846040519182526020820152604090810190519081900390206000818152600460209081526040808320805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a03891617905560059091529081902084905590915081907f52d7d861f09ab3d26239d492e8968629f95e9e318cf0b73bfddc441522a15fd290859051600160a060020a03909116815260200160405180910390a250505050565b60056020526000908152604090205481565b60005433600160a060020a0390811691161461060a57600080fd5b600160e060020a0319821660009081526006602052604090819020805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0384161790557f2ecd2c3368246547f4b77cc01b0d385557b66f2eb63e28f1008b74dd41a56d36908390839051600160e060020a03199092168252600160a060020a031660208201526040908101905180910390a15050565b600054600160a060020a031681565b6000805433600160a060020a039081169116146106c957600080fd5b6106d2836103af565b6040518082805190602001908083835b602083106107015780518252601f1990920191602091820191016106e2565b6001836020036101000a038019825116818451161790925250505091909101925060409150505190819003902060008181526003602052604090819020805460ff19168515151790559091507f8ab93b47bc41b2cb906046eae77cda278331ee4e7a8cc8e8f5eb1f159a33be44908290849051918252151560208201526040908101905180910390a1505050565b60005433600160a060020a039081169116146107aa57600080fd5b6000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0383161790557f95fd54179c11867fb083dd94347ea50f144dd4cfd7612b7bca169f162824af1681604051600160a060020a03909116815260200160405180910390a150565b60036020526000908152604090205460ff1681565b600460205260009081526040902054600160a060020a031681565b6000600254836040519182526020820152604090810190518091039020905061086a826103dd565b80156108ec5750600154600160a060020a0333811691166302571be38360006040516020015260405160e060020a63ffffffff84160281526004810191909152602401602060405180830381600087803b15156108c657600080fd5b6102c65a03f115156108d757600080fd5b50505060405180519050600160a060020a0316145b80156109665750600154600160a060020a03908116908316633f15457f6000604051602001526040518163ffffffff1660e060020a028152600401602060405180830381600087803b151561094057600080fd5b6102c65a03f1151561095157600080fd5b50505060405180519050600160a060020a0316145b80156109d75750600254600160a060020a03831663faff50a86000604051602001526040518163ffffffff1660e060020a028152600401602060405180830381600087803b15156109b657600080fd5b6102c65a03f115156109c757600080fd5b5050506040518051905060001916145b15156109e257600080fd5b60008181526004602052604090819020805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a03851617905581907f52d7d861f09ab3d26239d492e8968629f95e9e318cf0b73bfddc441522a15fd290849051600160a060020a03909116815260200160405180910390a2505050565b600660205260009081526040902054600160a060020a031681565b60025481565b602060405190810160405260008152905600a165627a7a72305820b91edb98941926825c62b758d5f43416958b465e62b149ef208c0a4543f862610029'  //  tslint:disable-line:max-line-length
  }

  /**
   * get the hash of the runtime-bin of a Contract 
   *
   * @returns {string} the hash of the runtime bytecode
   *
   */
  static get runtimeBinHash():string {
    return '0x458f43363a251458ee9ed3abf97891b3c6ca723d6df258662f1ce8ae0ab86ba4'  //  tslint:disable-line:max-line-length
  }

  /**
   * get the hash of the runtime-bin of a Contract 
   *
   * @returns {string} the hash of the runtime bytecode
   *
   */
  static is(address:string):Promise<boolean> {
    return defWeb3.eth.getCode(address).then(_=>defWeb3.utils.sha3(_)===USNResolver.runtimeBinHash)  //  tslint:disable-line:max-line-length
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    super(contract)
    this.contract = contract
  }

  contract: Contract

/**
 * the main regstry for all contracts based on the USN-Names
 *
 * deploy a new Contract
 *
 * @param {any} web3 - a optional web3-object
 * @param {Function} receiptCallback - a optional callBack, this will inform you of the receipt.
 * @returns {Promise<USNResolver>} a Promise for the deployed contract.
 *
 * @param {string} _ens - the ens
 * @param {string} _rootNode - the rootNode
 *
 */
 static deploy(_ens, _rootNode, tx?:Tx,web3?:Web3,receiptCallback?:(receipt:TransactionReceipt)=>any):Promise<USNResolver> {      // eslint-disable-line no-unused-vars
    const args = Array.prototype.slice.call(arguments)
    args.length && typeof(args[args.length-1])==='function' && args.pop()
    args.length && args[args.length-1] && args[args.length-1].eth && args.pop()
    args.length && typeof(args[args.length-1])==='object' && args.pop()
    const txo = new (web3||defWeb3).eth.Contract(USNResolver.abi).deploy({data:USNResolver.bin, arguments:args})
    txo.arguments = args
    log('debug',color.green('deploy USNResolver')+color.blackBright(' with ('+args.join()+')'))
    return txo.send(tx||{...defTx})
      .on('error', error=>log('error','deploy USNResolver : '+error.message,error))
      .on('transactionHash', h=>log('debug','deploy USNResolver : txhash = '+h))
      .on('receipt', receipt=>log('debug','deploy USNResolver : confirmed. address = '+receipt.contractAddress+' gasUsed = '+receipt.gasUsed))
      .on('receipt', receipt=> receiptCallback && receiptCallback(receipt))
      .then(_=>new USNResolver(_)) 
  }

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'USNResolver'
  }

  /**
   * returns true if the given interface is supported
   *
   * This is a readonly constant function.
   *
   * @param {string} _interfaceID - the 4 bytes-hash of the interface
   * @returns {Promise<boolean>}  - a Promise for the return value
   *
   */
  supportsInterface(_interfaceID:string):Promise<boolean> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNResolver.abi[0])
    return this.contract.methods.supportsInterface(...arguments).call().then(_=>validateCallResult(_,USNResolver.abi[0]))
  }

  /**
   * returns the code for a given address
   *
   * This is a readonly constant function.
   *
   * @param {string} _addr - the addr
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  getCodeAt(_addr:string):Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNResolver.abi[1])
    return this.contract.methods.getCodeAt(...arguments).call().then(_=>validateCallResult(_,USNResolver.abi[1]))
  }

  /**
   * returns true, if the code of the given address would be whitelisted
   *
   * This is a readonly constant function.
   *
   * @param {string} _address - the address of the deployed contract
   * @returns {Promise<boolean>}  - a Promise for the return value
   *
   */
  isWhitelisted(_address:string):Promise<boolean> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNResolver.abi[2])
    return this.contract.methods.isWhitelisted(...arguments).call().then(_=>validateCallResult(_,USNResolver.abi[2]))
  }

  /**
   * resolves the address for the given nodeid
   *
   * This is a readonly constant function.
   *
   * @param {string} _nodeID - the hash of of the rootNode+ hash of the name
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  addr(_nodeID:string):Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNResolver.abi[3])
    return this.contract.methods.addr(...arguments).call().then(_=>validateCallResult(_,USNResolver.abi[3]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ens():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNResolver.abi[4])
    return this.contract.methods.ens(...arguments).call().then(_=>validateCallResult(_,USNResolver.abi[4]))
  }

  /**
   * whitelists the code of not deployed contract
   *
   * This function requries a transaction.
   *
   * @param {string} _codeHash - the runtime-bin-hash of the contract
   * @param {boolean} _allow - flag indicating if this should be allowed or not
   *
   */
  setWhitelistedCode(_codeHash:string, _allow:boolean, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNResolver.abi[5])
    log('debug',color.green('USNResolver.setWhitelistedCode')+color.blackBright('(_codeHash='+_codeHash+', _allow='+_allow+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setWhitelistedCode(_codeHash, _allow).send(txargs||{...defTx})
      .on('error', error=>log('error','USNResolver.setWhitelistedCode : '+error.message,error))
      .on('transactionHash', txh=>log('debug','USNResolver.setWhitelistedCode : txhash = '+txh))
      .on('receipt', receipt=>log('debug','USNResolver.setWhitelistedCode : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * sets or changes a address for a contract, which is not deployed in the same chain.
   *
   * This function requries a transaction.
   *
   * @param {string} _subnode - the hash of the name registered
   * @param {string} _newAddress - the address of the contract
   * @param {string} _chainIPFS - the IPFS-Hash of the chain-defintion
   *
   */
  setAddressInChain(_subnode:string, _newAddress:string, _chainIPFS:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNResolver.abi[6])
    log('debug',color.green('USNResolver.setAddressInChain')+color.blackBright('(_subnode='+_subnode+', _newAddress='+_newAddress+', _chainIPFS='+_chainIPFS+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setAddressInChain(_subnode, _newAddress, _chainIPFS).send(txargs||{...defTx})
      .on('error', error=>log('error','USNResolver.setAddressInChain : '+error.message,error))
      .on('transactionHash', txh=>log('debug','USNResolver.setAddressInChain : txhash = '+txh))
      .on('receipt', receipt=>log('debug','USNResolver.setAddressInChain : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This is a readonly constant function.
   *
   * @param {string} key1 - the
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  chain(key1:string):Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNResolver.abi[7])
    return this.contract.methods.chain(...arguments).call().then(_=>validateCallResult(_,USNResolver.abi[7]))
  }

  /**
   * sets a library-contract
   *
   * This function requries a transaction.
   *
   * @param {string} _id - the hash or id of the interface
   * @param {string} _lib - the address
   *
   */
  setLib(_id:string, _lib:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNResolver.abi[8])
    log('debug',color.green('USNResolver.setLib')+color.blackBright('(_id='+_id+', _lib='+_lib+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setLib(_id, _lib).send(txargs||{...defTx})
      .on('error', error=>log('error','USNResolver.setLib : '+error.message,error))
      .on('transactionHash', txh=>log('debug','USNResolver.setLib : txhash = '+txh))
      .on('receipt', receipt=>log('debug','USNResolver.setLib : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * whitelists the code of existing contract
   *
   * This function requries a transaction.
   *
   * @param {string} _address - the address of the deployed contract
   * @param {boolean} _allow - flag indicating if this should be allowed or not
   *
   */
  setWhitelisted(_address:string, _allow:boolean, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNResolver.abi[10])
    log('debug',color.green('USNResolver.setWhitelisted')+color.blackBright('(_address='+_address+', _allow='+_allow+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setWhitelisted(_address, _allow).send(txargs||{...defTx})
      .on('error', error=>log('error','USNResolver.setWhitelisted : '+error.message,error))
      .on('transactionHash', txh=>log('debug','USNResolver.setWhitelisted : txhash = '+txh))
      .on('receipt', receipt=>log('debug','USNResolver.setWhitelisted : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This is a readonly constant function.
   *
   * @param {string} key1 - the
   * @returns {Promise<boolean>}  - a Promise for the return value
   *
   */
  whitelist(key1:string):Promise<boolean> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNResolver.abi[12])
    return this.contract.methods.whitelist(...arguments).call().then(_=>validateCallResult(_,USNResolver.abi[12]))
  }

  /**
   * This is a readonly constant function.
   *
   * @param {string} key1 - the
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  objects(key1:string):Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNResolver.abi[13])
    return this.contract.methods.objects(...arguments).call().then(_=>validateCallResult(_,USNResolver.abi[13]))
  }

  /**
   * changes the address of existing or new contract.
   *
   * This function requries a transaction.
   *
   * @param {string} _subnode - the hash of the name registered
   * @param {string} newContract - the address of the contract
   *
   */
  setAddress(_subnode:string, newContract:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNResolver.abi[14])
    log('debug',color.green('USNResolver.setAddress')+color.blackBright('(_subnode='+_subnode+', newContract='+newContract+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setAddress(_subnode, newContract).send(txargs||{...defTx})
      .on('error', error=>log('error','USNResolver.setAddress : '+error.message,error))
      .on('transactionHash', txh=>log('debug','USNResolver.setAddress : txhash = '+txh))
      .on('receipt', receipt=>log('debug','USNResolver.setAddress : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This is a readonly constant function.
   *
   * @param {string} key1 - the
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  lib(key1:string):Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNResolver.abi[15])
    return this.contract.methods.lib(...arguments).call().then(_=>validateCallResult(_,USNResolver.abi[15]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  rootNode():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,USNResolver.abi[16])
    return this.contract.methods.rootNode(...arguments).call().then(_=>validateCallResult(_,USNResolver.abi[16]))
  }

  /**
   * subsribes for incoming events.
   *
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeLogWhiteListUpdated(options?: { filter?: {}, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ _type?:string , _allowed?:boolean  }> {
    return this.contract.events.LogWhiteListUpdated(options)
  }

  /**
   * read PastEvents.
   *
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getLogWhiteListUpdated(options?: { filter?: {}, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ _type?:string , _allowed?:boolean  }>[]> {
    return (<any>this.contract).getPastEvents('LogWhiteListUpdated',options)
  }

  /**
   * subsribes for incoming events.
   *
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeLogLibUpdated(options?: { filter?: {}, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ _type?:string , newAddress?:string  }> {
    return this.contract.events.LogLibUpdated(options)
  }

  /**
   * read PastEvents.
   *
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getLogLibUpdated(options?: { filter?: {}, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ _type?:string , newAddress?:string  }>[]> {
    return (<any>this.contract).getPastEvents('LogLibUpdated',options)
  }

  /**
   * subsribes for incoming events.
   *
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeLogAddedObject(options?: { filter?: {}, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ _nodeID?:string  }> {
    return this.contract.events.LogAddedObject(options)
  }

  /**
   * read PastEvents.
   *
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getLogAddedObject(options?: { filter?: {}, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ _nodeID?:string  }>[]> {
    return (<any>this.contract).getPastEvents('LogAddedObject',options)
  }

  /**
   * subsribes for incoming events.
   *
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeLogRemovedObject(options?: { filter?: {}, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ _nodeID?:string  }> {
    return this.contract.events.LogRemovedObject(options)
  }

  /**
   * read PastEvents.
   *
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getLogRemovedObject(options?: { filter?: {}, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ _nodeID?:string  }>[]> {
    return (<any>this.contract).getPastEvents('LogRemovedObject',options)
  }

  /**
   * subsribes for incoming events.
   *
   * @param {string} node - the node
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeAddrChanged(options?: { filter?: {node?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ node?:string , a?:string  }> {
    return this.contract.events.AddrChanged(options)
  }

  /**
   * read PastEvents.
   *
   * @param {string} node - the node
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getAddrChanged(options?: { filter?: {node?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ node?:string , a?:string  }>[]> {
    return (<any>this.contract).getPastEvents('AddrChanged',options)
  }

}

}



export namespace features {

/**
 * control the access for a device.
 *
 */
export class AccessSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {AccessSupport} the AccessSupport
   *
   */
  static at(address:string, web3?:Web3):AccessSupport {  // tslint:disable-line:function-name
   return new AccessSupport( new (web3||defWeb3).eth.Contract( AccessSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[{name:'id',type:'bytes32'},{name:'user',type:'address'},{name:'action',type:'bytes4'}],name:'canAccess',outputs:[{name:'',type:'bool'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'AccessSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * verifies whther the user is in control or has access to the device.
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the deviceid
   * @param {string} user - the user on which this depend.
   * @param {string} action - constant which the user wants to execute
   * @returns {Promise<boolean>}  - a Promise for the return value
   *
   */
  canAccess(id:string, user:string, action:string):Promise<boolean> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessSupport.abi[0])
    return this.contract.methods.canAccess(...arguments).call().then(_=>validateCallResult(_,AccessSupport.abi[0]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessSupport.abi[1])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,AccessSupport.abi[1]))
  }

}

}



export namespace features {

/**
 * defines a blacklist for users to be rejected
 *
 */
export class BlackListSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {BlackListSupport} the BlackListSupport
   *
   */
  static at(address:string, web3?:Web3):BlackListSupport {  // tslint:disable-line:function-name
   return new BlackListSupport( new (web3||defWeb3).eth.Contract( BlackListSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:false,inputs:[{name:'id',type:'bytes32'},{name:'user',type:'address'},{name:'forbidden',type:'bool'}],name:'setBlacklisted',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'},{name:'user',type:'address'}],name:'isBlacklisted',outputs:[{name:'',type:'bool'}],payable:false,stateMutability:'view',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'BlackListSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * changes the blacklist
   *
   * This function requries a transaction.
   *
   * @param {string} id - device id
   * @param {string} user - the user to check
   * @param {boolean} forbidden - if true he will be blacklisted
   *
   */
  setBlacklisted(id:string, user:string, forbidden:boolean, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,BlackListSupport.abi[0])
    log('debug',color.green('BlackListSupport.setBlacklisted')+color.blackBright('(id='+id+', user='+user+', forbidden='+forbidden+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setBlacklisted(id, user, forbidden).send(txargs||{...defTx})
      .on('error', error=>log('error','BlackListSupport.setBlacklisted : '+error.message,error))
      .on('transactionHash', txh=>log('debug','BlackListSupport.setBlacklisted : txhash = '+txh))
      .on('receipt', receipt=>log('debug','BlackListSupport.setBlacklisted : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,BlackListSupport.abi[1])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,BlackListSupport.abi[1]))
  }

  /**
   * checks if a user is blacklisted
   *
   * This is a readonly constant function.
   *
   * @param {string} id - device id
   * @param {string} user - the user to check
   * @returns {Promise<boolean>}  - a Promise for the return value
   *
   */
  isBlacklisted(id:string, user:string):Promise<boolean> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,BlackListSupport.abi[2])
    return this.contract.methods.isBlacklisted(...arguments).call().then(_=>validateCallResult(_,BlackListSupport.abi[2]))
  }

}

}



export namespace features {

/**
 * supports acces control for depending devices.
 *
 */
export class DependendAccessSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {DependendAccessSupport} the DependendAccessSupport
   *
   */
  static at(address:string, web3?:Web3):DependendAccessSupport {  // tslint:disable-line:function-name
   return new DependendAccessSupport( new (web3||defWeb3).eth.Contract( DependendAccessSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:false,inputs:[{name:'id',type:'bytes32'},{name:'contracts',type:'address[]'},{name:'ids',type:'bytes32[]'}],name:'setDependingService',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'}],name:'getDependingService',outputs:[{name:'contracts',type:'address[]'},{name:'ids',type:'bytes32[]'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'DependendAccessSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * sets a list of contracts and deviceIds, which will also have access, if the user books this device.
   *
   * This function requries a transaction.
   *
   * @param {string} id - the device id
   * @param {string[]} contracts - the depending contracts
   * @param {string[]} ids - the depending device ids
   *
   */
  setDependingService(id:string, contracts:string[], ids:string[], txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,DependendAccessSupport.abi[0])
    log('debug',color.green('DependendAccessSupport.setDependingService')+color.blackBright('(id='+id+', contracts='+contracts+', ids='+ids+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setDependingService(id, contracts, ids).send(txargs||{...defTx})
      .on('error', error=>log('error','DependendAccessSupport.setDependingService : '+error.message,error))
      .on('transactionHash', txh=>log('debug','DependendAccessSupport.setDependingService : txhash = '+txh))
      .on('receipt', receipt=>log('debug','DependendAccessSupport.setDependingService : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * returns a list of contracts and deviceIds, which will also have access, if the user books this device.
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the device id
   * @returns {Promise<string[]>}  - a Promise for the return value
   * @returns {Promise<string[]>}  - a Promise for the return value
   *
   */
  getDependingService(id:string):Promise<{contracts:string[],ids:string[]}> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,DependendAccessSupport.abi[1])
    return this.contract.methods.getDependingService(...arguments).call().then(_=>validateCallResult(_,DependendAccessSupport.abi[1]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,DependendAccessSupport.abi[2])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,DependendAccessSupport.abi[2]))
  }

}

}



export namespace features {

/**
 * supports saving a deposit and returning it afterwards
 *
 */
export class DepositSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {DepositSupport} the DepositSupport
   *
   */
  static at(address:string, web3?:Web3):DepositSupport {  // tslint:disable-line:function-name
   return new DepositSupport( new (web3||defWeb3).eth.Contract( DepositSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[{name:'id',type:'bytes32'},{name:'user',type:'address'},{name:'secondsToRent',type:'uint32'},{name:'token',type:'address'}],name:'deposit',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'user',type:'address'},{name:'id',type:'bytes32'}],name:'storedDeposit',outputs:[{name:'amount',type:'uint128'},{name:'token',type:'address'},{name:'access',type:'uint64'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'user',type:'address'},{name:'id',type:'bytes32'}],name:'returnDeposit',outputs:[],payable:true,stateMutability:'payable',type:'function'},{anonymous:false,inputs:[{indexed:true,name:'user',type:'address'},{indexed:true,name:'id',type:'bytes32'},{indexed:false,name:'amount',type:'uint128'},{indexed:false,name:'token',type:'address'},{indexed:false,name:'access',type:'uint64'}],name:'LogDepositStored',type:'event'},{anonymous:false,inputs:[{indexed:true,name:'user',type:'address'},{indexed:true,name:'id',type:'bytes32'},{indexed:false,name:'amount',type:'uint128'},{indexed:false,name:'token',type:'address'}],name:'LogDepositReturned',type:'event'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'DepositSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * retrieves the currently stored deposit
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the id
   * @param {string} user - the user
   * @param {BN|number|string} secondsToRent - the secondsToRent
   * @param {string} token - the token
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  deposit(id:string, user:string, secondsToRent:BN|number|string, token:string):Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,DepositSupport.abi[0])
    return this.contract.methods.deposit(...arguments).call().then(_=>validateCallResult(_,DepositSupport.abi[0]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,DepositSupport.abi[1])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,DepositSupport.abi[1]))
  }

  /**
   * stores a deposit for a user
   *
   * This is a readonly constant function.
   *
   * @param {string} user - the user
   * @param {string} id - the id
   * @returns {Promise<BN>}  - a Promise for the return value
   * @returns {Promise<string>}  - a Promise for the return value
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  storedDeposit(user:string, id:string):Promise<{amount:BN,token:string,access:BN}> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,DepositSupport.abi[2])
    return this.contract.methods.storedDeposit(...arguments).call().then(_=>validateCallResult(_,DepositSupport.abi[2]))
  }

  /**
   * returns the deposit for the given user, which can be called after the wait-period
   *
   * This function requries a transaction.
   *
   * This function accepts ether.
   *
   * @param {string} user - the user
   * @param {string} id - the id
   *
   */
  returnDeposit(user:string, id:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,DepositSupport.abi[3])
    log('debug',color.green('DepositSupport.returnDeposit')+color.blackBright('(user='+user+', id='+id+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.returnDeposit(user, id).send(txargs||{...defTx})
      .on('error', error=>log('error','DepositSupport.returnDeposit : '+error.message,error))
      .on('transactionHash', txh=>log('debug','DepositSupport.returnDeposit : txhash = '+txh))
      .on('receipt', receipt=>log('debug','DepositSupport.returnDeposit : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * subsribes for incoming events.
   *
   * @param {string} user - the user
   * @param {string} id - the id
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeLogDepositStored(options?: { filter?: {user?:string , id?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ user?:string , id?:string , amount?:BN|number|string , token?:string , access?:BN|number|string  }> {
    return this.contract.events.LogDepositStored(options)
  }

  /**
   * read PastEvents.
   *
   * @param {string} user - the user
   * @param {string} id - the id
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getLogDepositStored(options?: { filter?: {user?:string , id?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ user?:string , id?:string , amount?:BN|number|string , token?:string , access?:BN|number|string  }>[]> {
    return (<any>this.contract).getPastEvents('LogDepositStored',options)
  }

  /**
   * subsribes for incoming events.
   *
   * @param {string} user - the user
   * @param {string} id - the id
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeLogDepositReturned(options?: { filter?: {user?:string , id?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ user?:string , id?:string , amount?:BN|number|string , token?:string  }> {
    return this.contract.events.LogDepositReturned(options)
  }

  /**
   * read PastEvents.
   *
   * @param {string} user - the user
   * @param {string} id - the id
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getLogDepositReturned(options?: { filter?: {user?:string , id?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ user?:string , id?:string , amount?:BN|number|string , token?:string  }>[]> {
    return (<any>this.contract).getPastEvents('LogDepositReturned',options)
  }

  subscribeAllEvents(options?: { filter?: any, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter {
    return this.contract.events.allEvents(options)
  }

  getAllEvents(options?: { filter?: any, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): Promise<EventLog[]> {
    return (<any>this.contract).getPastEvents('allEvents',options)
  }

}

}



export namespace features {

/**
 * support controlling acces for only identifieable users, which can be based on keybase or other whitleists
 *
 */
export class DiscountSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {DiscountSupport} the DiscountSupport
   *
   */
  static at(address:string, web3?:Web3):DiscountSupport {  // tslint:disable-line:function-name
   return new DiscountSupport( new (web3||defWeb3).eth.Contract( DiscountSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[{name:'id',type:'bytes32'},{name:'user',type:'address'},{name:'secondsToRent',type:'uint32'},{name:'token',type:'address'},{name:'standardPrice',type:'uint128'}],name:'discount',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'ruleId',type:'uint64'},{name:'discountType',type:'uint8'},{name:'limit',type:'uint128'},{name:'_discount',type:'uint128'}],name:'setDiscountRule',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'DiscountSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * the amount, which should price for rentinng the device
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the deviceid
   * @param {string} user - the user because prices may depend on the user (whitelisted or discount)
   * @param {BN|number|string} secondsToRent - the time of rental in seconds
   * @param {string} token - the address of the token to pay (See token-addreesses for details)
   * @param {BN|number|string} standardPrice - the standardPrice
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  discount(id:string, user:string, secondsToRent:BN|number|string, token:string, standardPrice:BN|number|string):Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,DiscountSupport.abi[0])
    return this.contract.methods.discount(...arguments).call().then(_=>validateCallResult(_,DiscountSupport.abi[0]))
  }

  /**
   * This function requries a transaction.
   *
   * @param {BN|number|string} ruleId - the ruleId
   * @param {BN|number|string} discountType - the discountType
   * @param {BN|number|string} limit - the limit
   * @param {BN|number|string} _discount - the discount
   *
   */
  setDiscountRule(ruleId:BN|number|string, discountType:BN|number|string, limit:BN|number|string, _discount:BN|number|string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,DiscountSupport.abi[1])
    log('debug',color.green('DiscountSupport.setDiscountRule')+color.blackBright('(ruleId='+ruleId+', discountType='+discountType+', limit='+limit+', _discount='+_discount+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setDiscountRule(ruleId, discountType, limit, _discount).send(txargs||{...defTx})
      .on('error', error=>log('error','DiscountSupport.setDiscountRule : '+error.message,error))
      .on('transactionHash', txh=>log('debug','DiscountSupport.setDiscountRule : txhash = '+txh))
      .on('receipt', receipt=>log('debug','DiscountSupport.setDiscountRule : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,DiscountSupport.abi[2])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,DiscountSupport.abi[2]))
  }

}

}



export namespace features {

/**
 */
export class GroupedSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {GroupedSupport} the GroupedSupport
   *
   */
  static at(address:string, web3?:Web3):GroupedSupport {  // tslint:disable-line:function-name
   return new GroupedSupport( new (web3||defWeb3).eth.Contract( GroupedSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[{name:'id',type:'bytes32'}],name:'nextID',outputs:[{name:'',type:'bytes32'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'group',type:'bytes32'}],name:'getCount',outputs:[{name:'',type:'uint64'}],payable:false,stateMutability:'view',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'GroupedSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * returns the next deviceId
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the id
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  nextID(id:string):Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,GroupedSupport.abi[0])
    return this.contract.methods.nextID(...arguments).call().then(_=>validateCallResult(_,GroupedSupport.abi[0]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,GroupedSupport.abi[1])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,GroupedSupport.abi[1]))
  }

  /**
   * returns the number of devices for the given group
   *
   * This is a readonly constant function.
   *
   * @param {string} group - the group
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  getCount(group:string):Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,GroupedSupport.abi[2])
    return this.contract.methods.getCount(...arguments).call().then(_=>validateCallResult(_,GroupedSupport.abi[2]))
  }

}

}



export namespace features {

/**
 * support controlling acces for only identifieable users, which can be based on keybase or other whitleists
 *
 */
export class IdentitySupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {IdentitySupport} the IdentitySupport
   *
   */
  static at(address:string, web3?:Web3):IdentitySupport {  // tslint:disable-line:function-name
   return new IdentitySupport( new (web3||defWeb3).eth.Contract( IdentitySupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[{name:'user',type:'address'}],name:'isIdentified',outputs:[{name:'',type:'bool'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'IdentitySupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * returns tru if the user can be identified.
   *
   * This is a readonly constant function.
   *
   * @param {string} user - the user
   * @returns {Promise<boolean>}  - a Promise for the return value
   *
   */
  isIdentified(user:string):Promise<boolean> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,IdentitySupport.abi[0])
    return this.contract.methods.isIdentified(...arguments).call().then(_=>validateCallResult(_,IdentitySupport.abi[0]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,IdentitySupport.abi[1])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,IdentitySupport.abi[1]))
  }

}

}



export namespace features {

/**
 * returns metadata for a device
 *
 */
export class MetaSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {MetaSupport} the MetaSupport
   *
   */
  static at(address:string, web3?:Web3):MetaSupport {  // tslint:disable-line:function-name
   return new MetaSupport( new (web3||defWeb3).eth.Contract( MetaSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[],name:'PROP_BOOKING_OFFCHAIN',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'PROP_IDENTITY_REQUIRED',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'PROP_BOOKING_ONCHAIN',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'}],name:'meta',outputs:[{name:'',type:'bytes'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'PROP_RENTABLE',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'BloomConstant',outputs:[{name:'',type:'bytes32'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'PROP_STATECHANNEL',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'}],name:'properties',outputs:[{name:'props',type:'uint128'},{name:'extra',type:'uint64'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'PROP_REFUND',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'PROP_CONTRACT_EXEC',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'PROP_EXTEND_TIME',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{anonymous:false,inputs:[{indexed:true,name:'fixFilter',type:'bytes32'},{indexed:true,name:'id',type:'bytes32'},{indexed:false,name:'endId',type:'bytes32'}],name:'LogDeviceChanged',type:'event'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'MetaSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  PROP_BOOKING_OFFCHAIN():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,MetaSupport.abi[0])
    return this.contract.methods.PROP_BOOKING_OFFCHAIN(...arguments).call().then(_=>validateCallResult(_,MetaSupport.abi[0]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  PROP_IDENTITY_REQUIRED():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,MetaSupport.abi[1])
    return this.contract.methods.PROP_IDENTITY_REQUIRED(...arguments).call().then(_=>validateCallResult(_,MetaSupport.abi[1]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  PROP_BOOKING_ONCHAIN():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,MetaSupport.abi[2])
    return this.contract.methods.PROP_BOOKING_ONCHAIN(...arguments).call().then(_=>validateCallResult(_,MetaSupport.abi[2]))
  }

  /**
   * created after the rent-function was executed the link to the metadata, which may also support ipfs:///...
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the deviceid
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  meta(id:string):Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,MetaSupport.abi[3])
    return this.contract.methods.meta(...arguments).call().then(_=>validateCallResult(_,MetaSupport.abi[3]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  PROP_RENTABLE():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,MetaSupport.abi[4])
    return this.contract.methods.PROP_RENTABLE(...arguments).call().then(_=>validateCallResult(_,MetaSupport.abi[4]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  BloomConstant():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,MetaSupport.abi[5])
    return this.contract.methods.BloomConstant(...arguments).call().then(_=>validateCallResult(_,MetaSupport.abi[5]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,MetaSupport.abi[6])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,MetaSupport.abi[6]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  PROP_STATECHANNEL():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,MetaSupport.abi[7])
    return this.contract.methods.PROP_STATECHANNEL(...arguments).call().then(_=>validateCallResult(_,MetaSupport.abi[7]))
  }

  /**
   * the properties or behavior defined per device, which is a bitmask with well defined values. (See https://github.com/slockit/usn-mvp/wiki/Types#deviceproperties)
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the deviceid
   * @returns {Promise<BN>}  - a Promise for the return value
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  properties(id:string):Promise<{props:BN,extra:BN}> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,MetaSupport.abi[8])
    return this.contract.methods.properties(...arguments).call().then(_=>validateCallResult(_,MetaSupport.abi[8]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  PROP_REFUND():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,MetaSupport.abi[9])
    return this.contract.methods.PROP_REFUND(...arguments).call().then(_=>validateCallResult(_,MetaSupport.abi[9]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  PROP_CONTRACT_EXEC():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,MetaSupport.abi[10])
    return this.contract.methods.PROP_CONTRACT_EXEC(...arguments).call().then(_=>validateCallResult(_,MetaSupport.abi[10]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  PROP_EXTEND_TIME():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,MetaSupport.abi[11])
    return this.contract.methods.PROP_EXTEND_TIME(...arguments).call().then(_=>validateCallResult(_,MetaSupport.abi[11]))
  }

  /**
   * subsribes for incoming events.
   *
   * @param {string} fixFilter - the fixFilter
   * @param {string} id - the id
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeLogDeviceChanged(options?: { filter?: {fixFilter?:string , id?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ fixFilter?:string , id?:string , endId?:string  }> {
    return this.contract.events.LogDeviceChanged(options)
  }

  /**
   * read PastEvents.
   *
   * @param {string} fixFilter - the fixFilter
   * @param {string} id - the id
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getLogDeviceChanged(options?: { filter?: {fixFilter?:string , id?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ fixFilter?:string , id?:string , endId?:string  }>[]> {
    return (<any>this.contract).getPastEvents('LogDeviceChanged',options)
  }

  subscribeAllEvents(options?: { filter?: any, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter {
    return this.contract.events.allEvents(options)
  }

  getAllEvents(options?: { filter?: any, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): Promise<EventLog[]> {
    return (<any>this.contract).getPastEvents('allEvents',options)
  }

}

}



export namespace features {

/**
 * support mutlisigs as controller of a device. In this case all keyholders have access when rented.
 *
 */
export class MultisigSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {MultisigSupport} the MultisigSupport
   *
   */
  static at(address:string, web3?:Web3):MultisigSupport {  // tslint:disable-line:function-name
   return new MultisigSupport( new (web3||defWeb3).eth.Contract( MultisigSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'}]
  }

  /**
   * get the bytecode of a Contract 
   *
   * @returns {string} the bytecode
   *
   */
  static get bin():string {
    return '0x6060604052341561000f57600080fd5b60d08061001d6000396000f300606060405263ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663b3cea2178114603b57600080fd5b3415604557600080fd5b604b6080565b6040517fffffffff00000000000000000000000000000000000000000000000000000000909116815260200160405180910390f35b7f7a26de3a00000000000000000000000000000000000000000000000000000000815600a165627a7a72305820115fa86dd9d00bf806830cfa1104d8f56f697472d525bfa1def28659c3d2b5b70029'  //  tslint:disable-line:max-line-length
  }

  /**
   * get the hash of the runtime-bin of a Contract 
   *
   * @returns {string} the hash of the runtime bytecode
   *
   */
  static get runtimeBinHash():string {
    return '0x4e3d603a0c933e8f12bc9a655d8fa1b9afa151978529cd9c6c2abf7c5a45d652'  //  tslint:disable-line:max-line-length
  }

  /**
   * get the hash of the runtime-bin of a Contract 
   *
   * @returns {string} the hash of the runtime bytecode
   *
   */
  static is(address:string):Promise<boolean> {
    return defWeb3.eth.getCode(address).then(_=>defWeb3.utils.sha3(_)===MultisigSupport.runtimeBinHash)  //  tslint:disable-line:max-line-length
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

/**
 * support mutlisigs as controller of a device. In this case all keyholders have access when rented.
 *
 * deploy a new Contract
 *
 * @param {any} web3 - a optional web3-object
 * @param {Function} receiptCallback - a optional callBack, this will inform you of the receipt.
 * @returns {Promise<MultisigSupport>} a Promise for the deployed contract.
 *
 */
 static deploy(tx?:Tx,web3?:Web3,receiptCallback?:(receipt:TransactionReceipt)=>any):Promise<MultisigSupport> {      // eslint-disable-line no-unused-vars
    const args = Array.prototype.slice.call(arguments)
    args.length && typeof(args[args.length-1])==='function' && args.pop()
    args.length && args[args.length-1] && args[args.length-1].eth && args.pop()
    args.length && typeof(args[args.length-1])==='object' && args.pop()
    const txo = new (web3||defWeb3).eth.Contract(MultisigSupport.abi).deploy({data:MultisigSupport.bin, arguments:args})
    txo.arguments = args
    log('debug',color.green('deploy MultisigSupport')+color.blackBright(' with ('+args.join()+')'))
    return txo.send(tx||{...defTx})
      .on('error', error=>log('error','deploy MultisigSupport : '+error.message,error))
      .on('transactionHash', h=>log('debug','deploy MultisigSupport : txhash = '+h))
      .on('receipt', receipt=>log('debug','deploy MultisigSupport : confirmed. address = '+receipt.contractAddress+' gasUsed = '+receipt.gasUsed))
      .on('receipt', receipt=> receiptCallback && receiptCallback(receipt))
      .then(_=>new MultisigSupport(_)) 
  }

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'MultisigSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,MultisigSupport.abi[0])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,MultisigSupport.abi[0]))
  }

}

}



export namespace features {

/**
 * defines Rules, which can be verified, even if the state is held on chain.
 *
 */
export class OffChainSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {OffChainSupport} the OffChainSupport
   *
   */
  static at(address:string, web3?:Web3):OffChainSupport {  // tslint:disable-line:function-name
   return new OffChainSupport( new (web3||defWeb3).eth.Contract( OffChainSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[{name:'id',type:'bytes32'},{name:'secondsToRent',type:'uint32'},{name:'amount',type:'uint128'},{name:'token',type:'address'},{name:'user',type:'address'},{name:'tokenReceiver',type:'bytes32'},{name:'controllerBefore',type:'address'},{name:'rentedUntilBefore',type:'uint64'},{name:'depositBefore',type:'uint128'}],name:'rentIf',outputs:[{name:'error',type:'uint16'},{name:'rentedUntilAfter',type:'uint64'},{name:'usedDeposit',type:'uint128'},{name:'depositAccess',type:'uint64'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'},{name:'user',type:'address'},{name:'action',type:'bytes4'},{name:'controller',type:'address'},{name:'rentedUntil',type:'uint64'}],name:'canAccessIf',outputs:[{name:'',type:'bool'}],payable:false,stateMutability:'view',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'OffChainSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * checks if the renting would be valid given the previous state and passed parameters
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the id
   * @param {BN|number|string} secondsToRent - the secondsToRent
   * @param {BN|number|string} amount - the amount
   * @param {string} token - the token
   * @param {string} user - the user
   * @param {string} tokenReceiver - the tokenReceiver
   * @param {string} controllerBefore - the controllerBefore
   * @param {BN|number|string} rentedUntilBefore - the rentedUntilBefore
   * @param {BN|number|string} depositBefore - the depositBefore
   * @returns {Promise<BN>}  - a Promise for the return value
   * @returns {Promise<BN>}  - a Promise for the return value
   * @returns {Promise<BN>}  - a Promise for the return value
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  rentIf(id:string, secondsToRent:BN|number|string, amount:BN|number|string, token:string, user:string, tokenReceiver:string, controllerBefore:string, rentedUntilBefore:BN|number|string, depositBefore:BN|number|string):Promise<{error:BN,rentedUntilAfter:BN,usedDeposit:BN,depositAccess:BN}> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,OffChainSupport.abi[0])
    return this.contract.methods.rentIf(...arguments).call().then(_=>validateCallResult(_,OffChainSupport.abi[0]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,OffChainSupport.abi[1])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,OffChainSupport.abi[1]))
  }

  /**
   * checks if the user would have access if under the given state
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the id
   * @param {string} user - the user
   * @param {string} action - the action
   * @param {string} controller - the controller
   * @param {BN|number|string} rentedUntil - the rentedUntil
   * @returns {Promise<boolean>}  - a Promise for the return value
   *
   */
  canAccessIf(id:string, user:string, action:string, controller:string, rentedUntil:BN|number|string):Promise<boolean> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,OffChainSupport.abi[2])
    return this.contract.methods.canAccessIf(...arguments).call().then(_=>validateCallResult(_,OffChainSupport.abi[2]))
  }

}

}



export namespace features {

/**
 * defines a owner for a device
 *
 */
export class OwnerSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {OwnerSupport} the OwnerSupport
   *
   */
  static at(address:string, web3?:Web3):OwnerSupport {  // tslint:disable-line:function-name
   return new OwnerSupport( new (web3||defWeb3).eth.Contract( OwnerSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'}],name:'deviceOwner',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'OwnerSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,OwnerSupport.abi[0])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,OwnerSupport.abi[0]))
  }

  /**
   * the owner of the device
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the deviceid
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  deviceOwner(id:string):Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,OwnerSupport.abi[1])
    return this.contract.methods.deviceOwner(...arguments).call().then(_=>validateCallResult(_,OwnerSupport.abi[1]))
  }

}

}



export namespace features {

/**
 * interface for a remote feature-contract
 *
 */
export class RemoteFeatureProvider {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {RemoteFeatureProvider} the RemoteFeatureProvider
   *
   */
  static at(address:string, web3?:Web3):RemoteFeatureProvider {  // tslint:disable-line:function-name
   return new RemoteFeatureProvider( new (web3||defWeb3).eth.Contract( RemoteFeatureProvider.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[{name:'registry',type:'address'},{name:'id',type:'bytes32'},{name:'user',type:'address'},{name:'rentedFrom',type:'uint64'},{name:'secondsToRent',type:'uint32'},{name:'token',type:'address'},{name:'srcPrice',type:'uint128'}],name:'price',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'registry',type:'address'},{name:'_id',type:'bytes32'},{name:'_secondsToRent',type:'uint32'},{name:'_token',type:'address'},{name:'_controller',type:'address'},{name:'_rentedFrom',type:'uint64'},{name:'allowRefund',type:'bool'}],name:'canRentFor',outputs:[{name:'rentable',type:'bool'},{name:'refund',type:'bool'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'registry',type:'address'},{name:'_id',type:'bytes32'},{name:'_user',type:'address'},{name:'action',type:'bytes4'},{name:'_controller',type:'address'},{name:'_rentedUntil',type:'uint64'}],name:'canAccessIf',outputs:[{name:'',type:'bool'}],payable:false,stateMutability:'view',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'RemoteFeatureProvider'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * This is a readonly constant function.
   *
   * @param {string} registry - the registry
   * @param {string} id - the id
   * @param {string} user - the user
   * @param {BN|number|string} rentedFrom - the rentedFrom
   * @param {BN|number|string} secondsToRent - the secondsToRent
   * @param {string} token - the token
   * @param {BN|number|string} srcPrice - the srcPrice
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  price(registry:string, id:string, user:string, rentedFrom:BN|number|string, secondsToRent:BN|number|string, token:string, srcPrice:BN|number|string):Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RemoteFeatureProvider.abi[0])
    return this.contract.methods.price(...arguments).call().then(_=>validateCallResult(_,RemoteFeatureProvider.abi[0]))
  }

  /**
   * This is a readonly constant function.
   *
   * @param {string} registry - the registry
   * @param {string} _id - the id
   * @param {BN|number|string} _secondsToRent - the secondsToRent
   * @param {string} _token - the token
   * @param {string} _controller - the controller
   * @param {BN|number|string} _rentedFrom - the rentedFrom
   * @param {boolean} allowRefund - the allowRefund
   * @returns {Promise<boolean>}  - a Promise for the return value
   * @returns {Promise<boolean>}  - a Promise for the return value
   *
   */
  canRentFor(registry:string, _id:string, _secondsToRent:BN|number|string, _token:string, _controller:string, _rentedFrom:BN|number|string, allowRefund:boolean):Promise<{rentable:boolean,refund:boolean}> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RemoteFeatureProvider.abi[1])
    return this.contract.methods.canRentFor(...arguments).call().then(_=>validateCallResult(_,RemoteFeatureProvider.abi[1]))
  }

  /**
   * This is a readonly constant function.
   *
   * @param {string} registry - the registry
   * @param {string} _id - the id
   * @param {string} _user - the user
   * @param {string} action - the action
   * @param {string} _controller - the controller
   * @param {BN|number|string} _rentedUntil - the rentedUntil
   * @returns {Promise<boolean>}  - a Promise for the return value
   *
   */
  canAccessIf(registry:string, _id:string, _user:string, action:string, _controller:string, _rentedUntil:BN|number|string):Promise<boolean> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RemoteFeatureProvider.abi[2])
    return this.contract.methods.canAccessIf(...arguments).call().then(_=>validateCallResult(_,RemoteFeatureProvider.abi[2]))
  }

}

}



export namespace features {

/**
 * support controlling acces for only identifieable users, which can be based on keybase or other whitleists
 *
 */
export class RemoteFeatureSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {RemoteFeatureSupport} the RemoteFeatureSupport
   *
   */
  static at(address:string, web3?:Web3):RemoteFeatureSupport {  // tslint:disable-line:function-name
   return new RemoteFeatureSupport( new (web3||defWeb3).eth.Contract( RemoteFeatureSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[],name:'featureCount',outputs:[{name:'',type:'uint256'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'',type:'uint256'}],name:'features',outputs:[{name:'feature',type:'address'},{name:'iface',type:'uint64'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'_addr',type:'address'},{name:'_interface',type:'uint64'}],name:'setRemoteFeature',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:false,inputs:[{name:'_addr',type:'address'}],name:'removeRemoteFeature',outputs:[{name:'found',type:'bool'}],payable:false,stateMutability:'nonpayable',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'RemoteFeatureSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  featureCount():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RemoteFeatureSupport.abi[0])
    return this.contract.methods.featureCount(...arguments).call().then(_=>validateCallResult(_,RemoteFeatureSupport.abi[0]))
  }

  /**
   * This is a readonly constant function.
   *
   * @param {BN|number|string} key1 - the
   * @returns {Promise<string>}  - a Promise for the return value
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  features(key1:BN|number|string):Promise<{feature:string,iface:BN}> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RemoteFeatureSupport.abi[1])
    return this.contract.methods.features(...arguments).call().then(_=>validateCallResult(_,RemoteFeatureSupport.abi[1]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RemoteFeatureSupport.abi[2])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,RemoteFeatureSupport.abi[2]))
  }

  /**
   * This function requries a transaction.
   *
   * @param {string} _addr - the addr
   * @param {BN|number|string} _interface - the interface
   *
   */
  setRemoteFeature(_addr:string, _interface:BN|number|string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RemoteFeatureSupport.abi[3])
    log('debug',color.green('RemoteFeatureSupport.setRemoteFeature')+color.blackBright('(_addr='+_addr+', _interface='+_interface+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setRemoteFeature(_addr, _interface).send(txargs||{...defTx})
      .on('error', error=>log('error','RemoteFeatureSupport.setRemoteFeature : '+error.message,error))
      .on('transactionHash', txh=>log('debug','RemoteFeatureSupport.setRemoteFeature : txhash = '+txh))
      .on('receipt', receipt=>log('debug','RemoteFeatureSupport.setRemoteFeature : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This function requries a transaction.
   *
   * @param {string} _addr - the addr
   * @returns {Promise<boolean>}  - a Promise for the return value
   *
   */
  removeRemoteFeature(_addr:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RemoteFeatureSupport.abi[4])
    log('debug',color.green('RemoteFeatureSupport.removeRemoteFeature')+color.blackBright('(_addr='+_addr+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.removeRemoteFeature(_addr).send(txargs||{...defTx})
      .on('error', error=>log('error','RemoteFeatureSupport.removeRemoteFeature : '+error.message,error))
      .on('transactionHash', txh=>log('debug','RemoteFeatureSupport.removeRemoteFeature : txhash = '+txh))
      .on('receipt', receipt=>log('debug','RemoteFeatureSupport.removeRemoteFeature : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

}

}



export namespace features {

/**
 * renting from a different account then the controller
 *
 */
export class RentForSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {RentForSupport} the RentForSupport
   *
   */
  static at(address:string, web3?:Web3):RentForSupport {  // tslint:disable-line:function-name
   return new RentForSupport( new (web3||defWeb3).eth.Contract( RentForSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:false,inputs:[{name:'id',type:'bytes32'},{name:'start',type:'uint256'}],name:'removeBooking',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:false,inputs:[{name:'id',type:'bytes32'},{name:'secondsToRent',type:'uint32'},{name:'token',type:'address'},{name:'controller',type:'address'},{name:'rentedFrom',type:'uint64'}],name:'rentFor',outputs:[],payable:true,stateMutability:'payable',type:'function'},{constant:false,inputs:[{name:'id',type:'bytes32'},{name:'secondsToRent',type:'uint32'},{name:'token',type:'address'},{name:'controller',type:'address'}],name:'rentForNow',outputs:[],payable:true,stateMutability:'payable',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'},{name:'user',type:'address'},{name:'start',type:'uint64'},{name:'secondsToRent',type:'uint32'}],name:'canBeRented',outputs:[{name:'',type:'bool'}],payable:false,stateMutability:'view',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'RentForSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * cancels a booking
   *
   * This function requries a transaction.
   *
   * @param {string} id - device id
   * @param {BN|number|string} start - the timestamp when the booking should start
   *
   */
  removeBooking(id:string, start:BN|number|string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RentForSupport.abi[0])
    log('debug',color.green('RentForSupport.removeBooking')+color.blackBright('(id='+id+', start='+start+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.removeBooking(id, start).send(txargs||{...defTx})
      .on('error', error=>log('error','RentForSupport.removeBooking : '+error.message,error))
      .on('transactionHash', txh=>log('debug','RentForSupport.removeBooking : txhash = '+txh))
      .on('receipt', receipt=>log('debug','RentForSupport.removeBooking : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * rents a device, which means it will change the state by setting the sender as controller.
   *
   * This function requries a transaction.
   *
   * This function accepts ether.
   *
   * @param {string} id - the deviceid
   * @param {BN|number|string} secondsToRent - the time of rental in seconds
   * @param {string} token - the address of the token to pay (See token-addreesses for details)
   * @param {string} controller - the user which should be allowed to control the device.
   * @param {BN|number|string} rentedFrom - the start time for this rental
   *
   */
  rentFor(id:string, secondsToRent:BN|number|string, token:string, controller:string, rentedFrom:BN|number|string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RentForSupport.abi[1])
    log('debug',color.green('RentForSupport.rentFor')+color.blackBright('(id='+id+', secondsToRent='+secondsToRent+', token='+token+', controller='+controller+', rentedFrom='+rentedFrom+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.rentFor(id, secondsToRent, token, controller, rentedFrom).send(txargs||{...defTx})
      .on('error', error=>log('error','RentForSupport.rentFor : '+error.message,error))
      .on('transactionHash', txh=>log('debug','RentForSupport.rentFor : txhash = '+txh))
      .on('receipt', receipt=>log('debug','RentForSupport.rentFor : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * rents a device, which means it will change the state by setting the sender as controller.
   *
   * This function requries a transaction.
   *
   * This function accepts ether.
   *
   * @param {string} id - the deviceid
   * @param {BN|number|string} secondsToRent - the time of rental in seconds
   * @param {string} token - the address of the token to pay (See token-addreesses for details)
   * @param {string} controller - the user which should be allowed to control the device.
   *
   */
  rentForNow(id:string, secondsToRent:BN|number|string, token:string, controller:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RentForSupport.abi[2])
    log('debug',color.green('RentForSupport.rentForNow')+color.blackBright('(id='+id+', secondsToRent='+secondsToRent+', token='+token+', controller='+controller+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.rentForNow(id, secondsToRent, token, controller).send(txargs||{...defTx})
      .on('error', error=>log('error','RentForSupport.rentForNow : '+error.message,error))
      .on('transactionHash', txh=>log('debug','RentForSupport.rentForNow : txhash = '+txh))
      .on('receipt', receipt=>log('debug','RentForSupport.rentForNow : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RentForSupport.abi[3])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,RentForSupport.abi[3]))
  }

  /**
   * checks if a booking is possible
   *
   * This is a readonly constant function.
   *
   * @param {string} id - device id
   * @param {string} user - the booking user
   * @param {BN|number|string} start - the timestamp when the booking should start
   * @param {BN|number|string} secondsToRent - the duration to book
   * @returns {Promise<boolean>}  - a Promise for the return value
   *
   */
  canBeRented(id:string, user:string, start:BN|number|string, secondsToRent:BN|number|string):Promise<boolean> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RentForSupport.abi[4])
    return this.contract.methods.canBeRented(...arguments).call().then(_=>validateCallResult(_,RentForSupport.abi[4]))
  }

}

}



export namespace features {

/**
 * defines a contract able to rent and return
 *
 */
export class RentingSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {RentingSupport} the RentingSupport
   *
   */
  static at(address:string, web3?:Web3):RentingSupport {  // tslint:disable-line:function-name
   return new RentingSupport( new (web3||defWeb3).eth.Contract( RentingSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:false,inputs:[{name:'id',type:'bytes32'},{name:'secondsToRent',type:'uint32'},{name:'token',type:'address'}],name:'rent',outputs:[],payable:true,stateMutability:'payable',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'},{name:'user',type:'address'}],name:'getRentingState',outputs:[{name:'rentable',type:'bool'},{name:'free',type:'bool'},{name:'open',type:'bool'},{name:'controller',type:'address'},{name:'rentedUntil',type:'uint64'},{name:'rentedFrom',type:'uint64'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'id',type:'bytes32'}],name:'returnObject',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'}],name:'supportedTokens',outputs:[{name:'addresses',type:'address[]'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'},{name:'token',type:'address'}],name:'tokenReceiver',outputs:[{name:'',type:'bytes32'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'},{name:'user',type:'address'},{name:'secondsToRent',type:'uint32'},{name:'token',type:'address'}],name:'price',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{anonymous:false,inputs:[{indexed:true,name:'fixFilter',type:'bytes32'},{indexed:true,name:'id',type:'bytes32'},{indexed:false,name:'controller',type:'address'},{indexed:false,name:'rentedFrom',type:'uint64'},{indexed:false,name:'rentedUntil',type:'uint64'},{indexed:false,name:'noReturn',type:'bool'},{indexed:false,name:'amount',type:'uint128'},{indexed:false,name:'token',type:'address'}],name:'LogRented',type:'event'},{anonymous:false,inputs:[{indexed:true,name:'fixFilter',type:'bytes32'},{indexed:true,name:'id',type:'bytes32'},{indexed:false,name:'controller',type:'address'},{indexed:false,name:'rentedFrom',type:'uint64'},{indexed:false,name:'rentedUntil',type:'uint64'},{indexed:false,name:'paidBack',type:'uint128'}],name:'LogReturned',type:'event'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'RentingSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * rents a device, which means it will change the state by setting the sender as controller.
   *
   * This function requries a transaction.
   *
   * This function accepts ether.
   *
   * @param {string} id - the deviceid
   * @param {BN|number|string} secondsToRent - the time of rental in seconds
   * @param {string} token - the address of the token to pay (See token-addreesses for details)
   *
   */
  rent(id:string, secondsToRent:BN|number|string, token:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RentingSupport.abi[0])
    log('debug',color.green('RentingSupport.rent')+color.blackBright('(id='+id+', secondsToRent='+secondsToRent+', token='+token+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.rent(id, secondsToRent, token).send(txargs||{...defTx})
      .on('error', error=>log('error','RentingSupport.rent : '+error.message,error))
      .on('transactionHash', txh=>log('debug','RentingSupport.rent : txhash = '+txh))
      .on('receipt', receipt=>log('debug','RentingSupport.rent : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * returns the current renting state
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the deviceid
   * @param {string} user - the user on which this may depend.
   * @returns {Promise<boolean>}  - a Promise for the return value
   * @returns {Promise<boolean>}  - a Promise for the return value
   * @returns {Promise<boolean>}  - a Promise for the return value
   * @returns {Promise<string>}  - a Promise for the return value
   * @returns {Promise<BN>}  - a Promise for the return value
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  getRentingState(id:string, user:string):Promise<{rentable:boolean,free:boolean,open:boolean,controller:string,rentedUntil:BN,rentedFrom:BN}> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RentingSupport.abi[1])
    return this.contract.methods.getRentingState(...arguments).call().then(_=>validateCallResult(_,RentingSupport.abi[1]))
  }

  /**
   * returns the Object or Device and also the funds are returned in case he returns it earlier than rentedUntil.
   *
   * This function requries a transaction.
   *
   * @param {string} id - the deviceid
   *
   */
  returnObject(id:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RentingSupport.abi[2])
    log('debug',color.green('RentingSupport.returnObject')+color.blackBright('(id='+id+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.returnObject(id).send(txargs||{...defTx})
      .on('error', error=>log('error','RentingSupport.returnObject : '+error.message,error))
      .on('transactionHash', txh=>log('debug','RentingSupport.returnObject : txhash = '+txh))
      .on('receipt', receipt=>log('debug','RentingSupport.returnObject : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RentingSupport.abi[3])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,RentingSupport.abi[3]))
  }

  /**
   * a list of supported tokens for the given device
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the deviceid
   * @returns {Promise<string[]>}  - a Promise for the return value
   *
   */
  supportedTokens(id:string):Promise<string[]> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RentingSupport.abi[4])
    return this.contract.methods.supportedTokens(...arguments).call().then(_=>validateCallResult(_,RentingSupport.abi[4]))
  }

  /**
   * the receiver of the token, which may be different than the owner or even a Bitcoin-address. For fiat this may be hash of payment-data.
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the deviceid
   * @param {string} token - the paid token
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  tokenReceiver(id:string, token:string):Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RentingSupport.abi[5])
    return this.contract.methods.tokenReceiver(...arguments).call().then(_=>validateCallResult(_,RentingSupport.abi[5]))
  }

  /**
   * the price for rentinng the device
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the deviceid
   * @param {string} user - the user because prices may depend on the user (whitelisted or discount)
   * @param {BN|number|string} secondsToRent - the time of rental in seconds
   * @param {string} token - the address of the token to pay (See token-addreesses for details)
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  price(id:string, user:string, secondsToRent:BN|number|string, token:string):Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,RentingSupport.abi[6])
    return this.contract.methods.price(...arguments).call().then(_=>validateCallResult(_,RentingSupport.abi[6]))
  }

  /**
   * subsribes for incoming events.
   *
   * @param {string} fixFilter - the fixFilter
   * @param {string} id - the id
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeLogRented(options?: { filter?: {fixFilter?:string , id?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ fixFilter?:string , id?:string , controller?:string , rentedFrom?:BN|number|string , rentedUntil?:BN|number|string , noReturn?:boolean , amount?:BN|number|string , token?:string  }> {
    return this.contract.events.LogRented(options)
  }

  /**
   * read PastEvents.
   *
   * @param {string} fixFilter - the fixFilter
   * @param {string} id - the id
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getLogRented(options?: { filter?: {fixFilter?:string , id?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ fixFilter?:string , id?:string , controller?:string , rentedFrom?:BN|number|string , rentedUntil?:BN|number|string , noReturn?:boolean , amount?:BN|number|string , token?:string  }>[]> {
    return (<any>this.contract).getPastEvents('LogRented',options)
  }

  /**
   * subsribes for incoming events.
   *
   * @param {string} fixFilter - the fixFilter
   * @param {string} id - the id
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeLogReturned(options?: { filter?: {fixFilter?:string , id?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ fixFilter?:string , id?:string , controller?:string , rentedFrom?:BN|number|string , rentedUntil?:BN|number|string , paidBack?:BN|number|string  }> {
    return this.contract.events.LogReturned(options)
  }

  /**
   * read PastEvents.
   *
   * @param {string} fixFilter - the fixFilter
   * @param {string} id - the id
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getLogReturned(options?: { filter?: {fixFilter?:string , id?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ fixFilter?:string , id?:string , controller?:string , rentedFrom?:BN|number|string , rentedUntil?:BN|number|string , paidBack?:BN|number|string  }>[]> {
    return (<any>this.contract).getPastEvents('LogReturned',options)
  }

  subscribeAllEvents(options?: { filter?: any, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter {
    return this.contract.events.allEvents(options)
  }

  getAllEvents(options?: { filter?: any, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): Promise<EventLog[]> {
    return (<any>this.contract).getPastEvents('allEvents',options)
  }

}

}



export namespace features {

/**
 * support  StateChannels
 *
 */
export class StateChannelSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {StateChannelSupport} the StateChannelSupport
   *
   */
  static at(address:string, web3?:Web3):StateChannelSupport {  // tslint:disable-line:function-name
   return new StateChannelSupport( new (web3||defWeb3).eth.Contract( StateChannelSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[{name:'id',type:'bytes32'}],name:'supportStateChannels',outputs:[{name:'',type:'bool'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'stateChannelMgr',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'StateChannelSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * check whether the single device is also allowing it
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the id
   * @returns {Promise<boolean>}  - a Promise for the return value
   *
   */
  supportStateChannels(id:string):Promise<boolean> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,StateChannelSupport.abi[0])
    return this.contract.methods.supportStateChannels(...arguments).call().then(_=>validateCallResult(_,StateChannelSupport.abi[0]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,StateChannelSupport.abi[1])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,StateChannelSupport.abi[1]))
  }

  /**
   * the address of the stateChannel manager
   *
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  stateChannelMgr():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,StateChannelSupport.abi[2])
    return this.contract.methods.stateChannelMgr(...arguments).call().then(_=>validateCallResult(_,StateChannelSupport.abi[2]))
  }

}

}



export namespace features {

/**
 * supports checks for a minimum and maximum time to rent
 *
 */
export class TimeRangeSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {TimeRangeSupport} the TimeRangeSupport
   *
   */
  static at(address:string, web3?:Web3):TimeRangeSupport {  // tslint:disable-line:function-name
   return new TimeRangeSupport( new (web3||defWeb3).eth.Contract( TimeRangeSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:false,inputs:[{name:'id',type:'bytes32'},{name:'min',type:'uint32'},{name:'max',type:'uint32'}],name:'setRangeSeconds',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'}],name:'getRangeSeconds',outputs:[{name:'min',type:'uint32'},{name:'max',type:'uint32'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'TimeRangeSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * sets the minimum and maximun time this device can be rented
   *
   * This function requries a transaction.
   *
   * @param {string} id - the device id
   * @param {BN|number|string} min - the minimum time in seconds or 0 if there is no limit
   * @param {BN|number|string} max - the maximun time in seconds or 0 if there is no limit
   *
   */
  setRangeSeconds(id:string, min:BN|number|string, max:BN|number|string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,TimeRangeSupport.abi[0])
    log('debug',color.green('TimeRangeSupport.setRangeSeconds')+color.blackBright('(id='+id+', min='+min+', max='+max+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setRangeSeconds(id, min, max).send(txargs||{...defTx})
      .on('error', error=>log('error','TimeRangeSupport.setRangeSeconds : '+error.message,error))
      .on('transactionHash', txh=>log('debug','TimeRangeSupport.setRangeSeconds : txhash = '+txh))
      .on('receipt', receipt=>log('debug','TimeRangeSupport.setRangeSeconds : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * returns the minimum and maximun time this device can be rented
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the device id
   * @returns {Promise<BN>}  - a Promise for the return value
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  getRangeSeconds(id:string):Promise<{min:BN,max:BN}> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,TimeRangeSupport.abi[1])
    return this.contract.methods.getRangeSeconds(...arguments).call().then(_=>validateCallResult(_,TimeRangeSupport.abi[1]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,TimeRangeSupport.abi[2])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,TimeRangeSupport.abi[2]))
  }

}

}



export namespace features {

/**
 * supports exchanges between different tokens
 *
 */
export class TokenSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {TokenSupport} the TokenSupport
   *
   */
  static at(address:string, web3?:Web3):TokenSupport {  // tslint:disable-line:function-name
   return new TokenSupport( new (web3||defWeb3).eth.Contract( TokenSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'id',type:'bytes32'},{name:'addresses',type:'address[]'}],name:'setSupportedTokens',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'TokenSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,TokenSupport.abi[0])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,TokenSupport.abi[0]))
  }

  /**
   * sets the list of supported tokens
   *
   * This function requries a transaction.
   *
   * @param {string} id - the id
   * @param {string[]} addresses - the addresses
   *
   */
  setSupportedTokens(id:string, addresses:string[], txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,TokenSupport.abi[1])
    log('debug',color.green('TokenSupport.setSupportedTokens')+color.blackBright('(id='+id+', addresses='+addresses+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setSupportedTokens(id, addresses).send(txargs||{...defTx})
      .on('error', error=>log('error','TokenSupport.setSupportedTokens : '+error.message,error))
      .on('transactionHash', txh=>log('debug','TokenSupport.setSupportedTokens : txhash = '+txh))
      .on('receipt', receipt=>log('debug','TokenSupport.setSupportedTokens : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

}

}



export namespace features {

/**
 * supports for signing messages by the device.
 *
 */
export class VerifiedDeviceSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {VerifiedDeviceSupport} the VerifiedDeviceSupport
   *
   */
  static at(address:string, web3?:Web3):VerifiedDeviceSupport {  // tslint:disable-line:function-name
   return new VerifiedDeviceSupport( new (web3||defWeb3).eth.Contract( VerifiedDeviceSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[{name:'id',type:'bytes32'}],name:'devicePubKey',outputs:[{name:'',type:'bytes32'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'id',type:'bytes32'},{name:'_address',type:'bytes32'}],name:'setDevicePubKey',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'VerifiedDeviceSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * returns the public address of the
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the id
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  devicePubKey(id:string):Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,VerifiedDeviceSupport.abi[0])
    return this.contract.methods.devicePubKey(...arguments).call().then(_=>validateCallResult(_,VerifiedDeviceSupport.abi[0]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,VerifiedDeviceSupport.abi[1])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,VerifiedDeviceSupport.abi[1]))
  }

  /**
   * sets the public address of the
   *
   * This function requries a transaction.
   *
   * @param {string} id - the id
   * @param {string} _address - the address
   *
   */
  setDevicePubKey(id:string, _address:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,VerifiedDeviceSupport.abi[2])
    log('debug',color.green('VerifiedDeviceSupport.setDevicePubKey')+color.blackBright('(id='+id+', _address='+_address+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setDevicePubKey(id, _address).send(txargs||{...defTx})
      .on('error', error=>log('error','VerifiedDeviceSupport.setDevicePubKey : '+error.message,error))
      .on('transactionHash', txh=>log('debug','VerifiedDeviceSupport.setDevicePubKey : txhash = '+txh))
      .on('receipt', receipt=>log('debug','VerifiedDeviceSupport.setDevicePubKey : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

}

}



export namespace features {

/**
 * the Implementation for a whitelist for all devices in this contract.
 *
 */
export class VerifiedDeviceSupportPerContractImpl extends features.OwnerSupport implements features.VerifiedDeviceSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return [OwnerSupport,VerifiedDeviceSupport]
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {VerifiedDeviceSupportPerContractImpl} the VerifiedDeviceSupportPerContractImpl
   *
   */
  static at(address:string, web3?:Web3):VerifiedDeviceSupportPerContractImpl {  // tslint:disable-line:function-name
   return new VerifiedDeviceSupportPerContractImpl( new (web3||defWeb3).eth.Contract( VerifiedDeviceSupportPerContractImpl.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[],name:'deviceVerificationAddress',outputs:[{name:'',type:'bytes32'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'',type:'bytes32'}],name:'devicePubKey',outputs:[{name:'',type:'bytes32'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'_id',type:'bytes32'},{name:'_address',type:'bytes32'}],name:'setDevicePubKey',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'}],name:'deviceOwner',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    super(contract)
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'VerifiedDeviceSupportPerContractImpl'
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  deviceVerificationAddress():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,VerifiedDeviceSupportPerContractImpl.abi[0])
    return this.contract.methods.deviceVerificationAddress(...arguments).call().then(_=>validateCallResult(_,VerifiedDeviceSupportPerContractImpl.abi[0]))
  }

  /**
   * returns the public address of the
   *
   * This is a readonly constant function.
   *
   * @param {string} key1 - the
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  devicePubKey(key1:string):Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,VerifiedDeviceSupportPerContractImpl.abi[1])
    return this.contract.methods.devicePubKey(...arguments).call().then(_=>validateCallResult(_,VerifiedDeviceSupportPerContractImpl.abi[1]))
  }

  /**
   * set the device address
   *
   * This function requries a transaction.
   *
   * @param {string} _id - device id
   * @param {string} _address - address
   *
   */
  setDevicePubKey(_id:string, _address:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,VerifiedDeviceSupportPerContractImpl.abi[3])
    log('debug',color.green('VerifiedDeviceSupportPerContractImpl.setDevicePubKey')+color.blackBright('(_id='+_id+', _address='+_address+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setDevicePubKey(_id, _address).send(txargs||{...defTx})
      .on('error', error=>log('error','VerifiedDeviceSupportPerContractImpl.setDevicePubKey : '+error.message,error))
      .on('transactionHash', txh=>log('debug','VerifiedDeviceSupportPerContractImpl.setDevicePubKey : txhash = '+txh))
      .on('receipt', receipt=>log('debug','VerifiedDeviceSupportPerContractImpl.setDevicePubKey : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

}

}



export namespace features {

/**
 * supports for signing messages by the device with one signature per device.
 *
 */
export class VerifiedDeviceSupportPerDeviceImpl extends features.VerifiedDeviceSupport implements features.OwnerSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return [VerifiedDeviceSupport,OwnerSupport]
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {VerifiedDeviceSupportPerDeviceImpl} the VerifiedDeviceSupportPerDeviceImpl
   *
   */
  static at(address:string, web3?:Web3):VerifiedDeviceSupportPerDeviceImpl {  // tslint:disable-line:function-name
   return new VerifiedDeviceSupportPerDeviceImpl( new (web3||defWeb3).eth.Contract( VerifiedDeviceSupportPerDeviceImpl.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[{name:'_id',type:'bytes32'}],name:'devicePubKey',outputs:[{name:'',type:'bytes32'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'_id',type:'bytes32'},{name:'_address',type:'bytes32'}],name:'setDevicePubKey',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'}],name:'deviceOwner',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    super(contract)
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'VerifiedDeviceSupportPerDeviceImpl'
  }

  /**
   * the owner of the device
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the deviceid
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  deviceOwner(id:string):Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,VerifiedDeviceSupportPerDeviceImpl.abi[3])
    return this.contract.methods.deviceOwner(...arguments).call().then(_=>validateCallResult(_,VerifiedDeviceSupportPerDeviceImpl.abi[3]))
  }

}

}



export namespace features {

/**
 * supports controlling acces by setting opening times per weekday
 *
 */
export class WeekCalendarSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {WeekCalendarSupport} the WeekCalendarSupport
   *
   */
  static at(address:string, web3?:Web3):WeekCalendarSupport {  // tslint:disable-line:function-name
   return new WeekCalendarSupport( new (web3||defWeb3).eth.Contract( WeekCalendarSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:false,inputs:[{name:'id',type:'bytes32'},{name:'_blockedTimes',type:'uint256'}],name:'setBlockedTimes',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'},{name:'time',type:'uint64'}],name:'isBlocked',outputs:[{name:'',type:'bool'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'}],name:'blockedTimes',outputs:[{name:'',type:'uint256'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'WeekCalendarSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * a bitmask for 24*7 bits where each set bit is blocking and signals closed
   *
   * This function requries a transaction.
   *
   * @param {string} id - the id
   * @param {BN|number|string} _blockedTimes - the blockedTimes
   *
   */
  setBlockedTimes(id:string, _blockedTimes:BN|number|string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,WeekCalendarSupport.abi[0])
    log('debug',color.green('WeekCalendarSupport.setBlockedTimes')+color.blackBright('(id='+id+', _blockedTimes='+_blockedTimes+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setBlockedTimes(id, _blockedTimes).send(txargs||{...defTx})
      .on('error', error=>log('error','WeekCalendarSupport.setBlockedTimes : '+error.message,error))
      .on('transactionHash', txh=>log('debug','WeekCalendarSupport.setBlockedTimes : txhash = '+txh))
      .on('receipt', receipt=>log('debug','WeekCalendarSupport.setBlockedTimes : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * checks if this is closed
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the id
   * @param {BN|number|string} time - the time
   * @returns {Promise<boolean>}  - a Promise for the return value
   *
   */
  isBlocked(id:string, time:BN|number|string):Promise<boolean> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,WeekCalendarSupport.abi[1])
    return this.contract.methods.isBlocked(...arguments).call().then(_=>validateCallResult(_,WeekCalendarSupport.abi[1]))
  }

  /**
   * a bitmask for 24*7 bits where each set bit is blocking and signals closed
   *
   * This is a readonly constant function.
   *
   * @param {string} id - the id
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  blockedTimes(id:string):Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,WeekCalendarSupport.abi[2])
    return this.contract.methods.blockedTimes(...arguments).call().then(_=>validateCallResult(_,WeekCalendarSupport.abi[2]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,WeekCalendarSupport.abi[3])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,WeekCalendarSupport.abi[3]))
  }

}

}



export namespace features {

/**
 * Defines additional access for certain users, (like the cleaning lady in an appartment)
 *
 */
export class WhitelistSupport {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {WhitelistSupport} the WhitelistSupport
   *
   */
  static at(address:string, web3?:Web3):WhitelistSupport {  // tslint:disable-line:function-name
   return new WhitelistSupport( new (web3||defWeb3).eth.Contract( WhitelistSupport.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:false,inputs:[{name:'id',type:'bytes32'},{name:'user',type:'address'},{name:'hasAccess',type:'bool'}],name:'setAccessWhitelist',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'},{anonymous:false,inputs:[{indexed:true,name:'id',type:'bytes32'},{indexed:true,name:'controller',type:'address'},{indexed:false,name:'permission',type:'bool'}],name:'LogAccessChanged',type:'event'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'WhitelistSupport'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * changes values on the whitelist
   *
   * This function requries a transaction.
   *
   * @param {string} id - device id
   * @param {string} user - the user to put on the whitelist
   * @param {boolean} hasAccess - true|false to give permission
   *
   */
  setAccessWhitelist(id:string, user:string, hasAccess:boolean, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,WhitelistSupport.abi[0])
    log('debug',color.green('WhitelistSupport.setAccessWhitelist')+color.blackBright('(id='+id+', user='+user+', hasAccess='+hasAccess+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setAccessWhitelist(id, user, hasAccess).send(txargs||{...defTx})
      .on('error', error=>log('error','WhitelistSupport.setAccessWhitelist : '+error.message,error))
      .on('transactionHash', txh=>log('debug','WhitelistSupport.setAccessWhitelist : txhash = '+txh))
      .on('receipt', receipt=>log('debug','WhitelistSupport.setAccessWhitelist : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ID():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,WhitelistSupport.abi[1])
    return this.contract.methods.ID(...arguments).call().then(_=>validateCallResult(_,WhitelistSupport.abi[1]))
  }

  /**
   * subsribes for incoming events.
   *
   * @param {string} id - the id
   * @param {string} controller - the controller
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeLogAccessChanged(options?: { filter?: {id?:string , controller?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ id?:string , controller?:string , permission?:boolean  }> {
    return this.contract.events.LogAccessChanged(options)
  }

  /**
   * read PastEvents.
   *
   * @param {string} id - the id
   * @param {string} controller - the controller
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getLogAccessChanged(options?: { filter?: {id?:string , controller?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ id?:string , controller?:string , permission?:boolean  }>[]> {
    return (<any>this.contract).getPastEvents('LogAccessChanged',options)
  }

  subscribeAllEvents(options?: { filter?: any, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter {
    return this.contract.events.allEvents(options)
  }

  getAllEvents(options?: { filter?: any, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): Promise<EventLog[]> {
    return (<any>this.contract).getPastEvents('allEvents',options)
  }

}

}



export namespace impl {

/**
 */
export class AccessOnly extends features.AccessSupport implements interfaces.Owned,features.WhitelistSupport,features.MetaSupport,features.OwnerSupport,ENS.USNResolvable {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return [features.AccessSupport,interfaces.Owned,features.WhitelistSupport,features.MetaSupport,features.OwnerSupport,ENS.USNResolvable]
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {AccessOnly} the AccessOnly
   *
   */
  static at(address:string, web3?:Web3):AccessOnly {  // tslint:disable-line:function-name
   return new AccessOnly( new (web3||defWeb3).eth.Contract( AccessOnly.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[{name:'_interfaceID',type:'bytes4'}],name:'supportsInterface',outputs:[{name:'',type:'bool'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'PROP_BOOKING_OFFCHAIN',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'id',type:'bytes32'},{name:'user',type:'address'},{name:'hasAccess',type:'bool'}],name:'setAccessWhitelist',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[],name:'PROP_IDENTITY_REQUIRED',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'ens',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'PROP_BOOKING_ONCHAIN',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'}],name:'meta',outputs:[{name:'',type:'bytes'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'',type:'bytes32'}],name:'registry',outputs:[{name:'props',type:'uint128'},{name:'extra',type:'uint64'},{name:'meta',type:'bytes'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'PROP_RENTABLE',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'owner',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'_id',type:'bytes32'},{name:'_meta',type:'bytes'},{name:'props',type:'uint128'}],name:'setObject',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[],name:'ACCESS_ONLY',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'},{name:'user',type:'address'},{name:'',type:'bytes4'}],name:'canAccess',outputs:[{name:'',type:'bool'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'BloomConstant',outputs:[{name:'',type:'bytes32'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'_newOwner',type:'address'}],name:'changeOwner',outputs:[],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[],name:'ID',outputs:[{name:'',type:'bytes4'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'PROP_STATECHANNEL',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'id',type:'bytes32'}],name:'properties',outputs:[{name:'props',type:'uint128'},{name:'extra',type:'uint64'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'',type:'bytes32'}],name:'deviceOwner',outputs:[{name:'',type:'address'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'PROP_REFUND',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'PROP_CONTRACT_EXEC',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'PROP_EXTEND_TIME',outputs:[{name:'',type:'uint128'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'rootNode',outputs:[{name:'',type:'bytes32'}],payable:false,stateMutability:'view',type:'function'},{inputs:[{name:'_ens',type:'address'},{name:'_rootNode',type:'bytes32'}],payable:false,stateMutability:'nonpayable',type:'constructor'},{payable:false,stateMutability:'nonpayable',type:'fallback'},{anonymous:false,inputs:[{indexed:true,name:'fixFilter',type:'bytes32'},{indexed:true,name:'id',type:'bytes32'},{indexed:false,name:'endId',type:'bytes32'}],name:'LogDeviceChanged',type:'event'},{anonymous:false,inputs:[{indexed:true,name:'id',type:'bytes32'},{indexed:true,name:'controller',type:'address'},{indexed:false,name:'permission',type:'bool'}],name:'LogAccessChanged',type:'event'},{anonymous:false,inputs:[{indexed:false,name:'_newOwner',type:'address'}],name:'LogChangeOwner',type:'event'}]
  }

  /**
   * get the bytecode of a Contract 
   *
   * @returns {string} the bytecode
   *
   */
  static get bin():string {
    return '0x6060604052341561000f57600080fd5b604051604080610c42833981016040528080519190602001805160008054600160a060020a03338116600160a060020a03199283161790925560018054969092169516949094179093555050600255610bd58061006d6000396000f300606060405236156101305763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166301ffc9a781146101405780630cc34ba4146101745780632d5ffe7c146101ac5780633a858be7146101d55780633f15457f146101e85780634ddc890b146102175780635fa80c121461022a5780637ef50298146102b75780638112ae131461037f5780638da5cb5b1461039257806397740cc4146103a55780639b3bd8a31461040f578063a0b0305f1461043f578063a33394de1461046e578063a6f9dae114610493578063b3cea217146104b2578063b903cdb1146104c5578063bd156273146104d8578063d414d53614610523578063d589c6f614610539578063e742e0601461054c578063eeab9d2c1461055f578063faff50a814610572575b341561013b57600080fd5b600080fd5b341561014b57600080fd5b610160600160e060020a031960043516610585565b604051901515815260200160405180910390f35b341561017f57600080fd5b6101876106be565b6040516fffffffffffffffffffffffffffffffff909116815260200160405180910390f35b34156101b757600080fd5b6101d3600435600160a060020a036024351660443515156106c3565b005b34156101e057600080fd5b610187610751565b34156101f357600080fd5b6101fb610756565b604051600160a060020a03909116815260200160405180910390f35b341561022257600080fd5b610187610765565b341561023557600080fd5b61024060043561076a565b60405160208082528190810183818151815260200191508051906020019080838360005b8381101561027c578082015183820152602001610264565b50505050905090810190601f1680156102a95780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156102c257600080fd5b6102cd600435610830565b6040516fffffffffffffffffffffffffffffffff8416815267ffffffffffffffff831660208201526060604082018181528354600260001961010060018416150201909116049183018290529060808301908490801561036e5780601f106103435761010080835404028352916020019161036e565b820191906000526020600020905b81548152906001019060200180831161035157829003601f168201915b505094505050505060405180910390f35b341561038a57600080fd5b61018761087a565b341561039d57600080fd5b6101fb61087f565b34156103b057600080fd5b6101d3600480359060446024803590810190830135806020601f82018190048102016040519081016040528181529291906020840183838082843750949650505092356fffffffffffffffffffffffffffffffff16925061088e915050565b341561041a57600080fd5b610422610955565b604051600160e060020a0319909116815260200160405180910390f35b341561044a57600080fd5b610160600435600160a060020a0360243516600160e060020a031960443516610979565b341561047957600080fd5b6104816109c2565b60405190815260200160405180910390f35b341561049e57600080fd5b6101d3600160a060020a03600435166109e6565b34156104bd57600080fd5b610422610a69565b34156104d057600080fd5b610187610a8d565b34156104e357600080fd5b6104ee600435610a92565b6040516fffffffffffffffffffffffffffffffff909216825267ffffffffffffffff1660208201526040908101905180910390f35b341561052e57600080fd5b6101fb600435610ad7565b341561054457600080fd5b610187610ae7565b341561055757600080fd5b610187610aec565b341561056a57600080fd5b610187610af1565b341561057d57600080fd5b610481610af6565b60007f3b3b57de00000000000000000000000000000000000000000000000000000000600160e060020a0319831614806105e85750600160e060020a031982167fd1559fbc00000000000000000000000000000000000000000000000000000000145b8061061c5750600160e060020a031982167fd63efd0900000000000000000000000000000000000000000000000000000000145b806106505750600160e060020a031982167fb4762fab00000000000000000000000000000000000000000000000000000000145b806106845750600160e060020a031982167ffb4ca7b300000000000000000000000000000000000000000000000000000000145b806106b85750600160e060020a031982167fd63efd0900000000000000000000000000000000000000000000000000000000145b92915050565b604081565b60005433600160a060020a039081169116146106de57600080fd5b6000838152600360209081526040808320600160a060020a038616808552600290910190925291829020805460ff19168415151790559084907f3783d1c36d48faa38fe1fab9010cf48694baea31beef28fc36a1a6b79f7e633390849051901515815260200160405180910390a3505050565b602081565b600154600160a060020a031681565b608081565b610772610afc565b6003600083600019166000191681526020019081526020016000206001018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108245780601f106107f957610100808354040283529160200191610824565b820191906000526020600020905b81548152906001019060200180831161080757829003601f168201915b50505050509050919050565b600360205260009081526040902080546fffffffffffffffffffffffffffffffff81169170010000000000000000000000000000000090910467ffffffffffffffff169060010183565b600181565b600054600160a060020a031681565b6000805433600160a060020a039081169116146108aa57600080fd5b506000838152600360205260409020600181018380516108ce929160200190610b0e565b5080546fffffffffffffffffffffffffffffffff19166fffffffffffffffffffffffffffffffff8316178155837fa2f7689fc12ea917d9029117d32b9fdef2a53462c853462ca86b71b97dd84af67feaeb84f57cd9c1b4f758212c989380b3eb4ec764ed512ffcf00470301b476be18260405190815260200160405180910390a350505050565b7fff0000030000000000000000000000000000000000000000000000000000000081565b6000838152600360209081526040808320600160a060020a038616845260020190915281205460ff16806109ba5750600054600160a060020a038481169116145b949350505050565b7fa2f7689fc12ea917d9029117d32b9fdef2a53462c853462ca86b71b97dd84af681565b60005433600160a060020a03908116911614610a0157600080fd5b6000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0383161790557f95fd54179c11867fb083dd94347ea50f144dd4cfd7612b7bca169f162824af1681604051600160a060020a03909116815260200160405180910390a150565b7fb4762fab0000000000000000000000000000000000000000000000000000000081565b600281565b6000908152600360205260409020546fffffffffffffffffffffffffffffffff81169170010000000000000000000000000000000090910467ffffffffffffffff1690565b50600054600160a060020a031690565b600881565b600481565b601081565b60025481565b60206040519081016040526000815290565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610b4f57805160ff1916838001178555610b7c565b82800160010185558215610b7c579182015b82811115610b7c578251825591602001919060010190610b61565b50610b88929150610b8c565b5090565b610ba691905b80821115610b885760008155600101610b92565b905600a165627a7a72305820f8b8484e149f4ce22ca9304c835d2ed0786fd223b7a94294b3fef376258243e30029'  //  tslint:disable-line:max-line-length
  }

  /**
   * get the hash of the runtime-bin of a Contract 
   *
   * @returns {string} the hash of the runtime bytecode
   *
   */
  static get runtimeBinHash():string {
    return '0xc5689e94b4fc238a5a7eeb8558d60a69ba54cd2e135ddde3798594a37c41bacc'  //  tslint:disable-line:max-line-length
  }

  /**
   * get the hash of the runtime-bin of a Contract 
   *
   * @returns {string} the hash of the runtime bytecode
   *
   */
  static is(address:string):Promise<boolean> {
    return defWeb3.eth.getCode(address).then(_=>defWeb3.utils.sha3(_)===AccessOnly.runtimeBinHash)  //  tslint:disable-line:max-line-length
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    super(contract)
    this.contract = contract
  }

  contract: Contract

/**
 * deploy a new Contract
 *
 * @param {any} web3 - a optional web3-object
 * @param {Function} receiptCallback - a optional callBack, this will inform you of the receipt.
 * @returns {Promise<AccessOnly>} a Promise for the deployed contract.
 *
 * @param {string} _ens - the ens
 * @param {string} _rootNode - the rootNode
 *
 */
 static deploy(_ens, _rootNode, tx?:Tx,web3?:Web3,receiptCallback?:(receipt:TransactionReceipt)=>any):Promise<AccessOnly> {      // eslint-disable-line no-unused-vars
    const args = Array.prototype.slice.call(arguments)
    args.length && typeof(args[args.length-1])==='function' && args.pop()
    args.length && args[args.length-1] && args[args.length-1].eth && args.pop()
    args.length && typeof(args[args.length-1])==='object' && args.pop()
    const txo = new (web3||defWeb3).eth.Contract(AccessOnly.abi).deploy({data:AccessOnly.bin, arguments:args})
    txo.arguments = args
    log('debug',color.green('deploy AccessOnly')+color.blackBright(' with ('+args.join()+')'))
    return txo.send(tx||{...defTx})
      .on('error', error=>log('error','deploy AccessOnly : '+error.message,error))
      .on('transactionHash', h=>log('debug','deploy AccessOnly : txhash = '+h))
      .on('receipt', receipt=>log('debug','deploy AccessOnly : confirmed. address = '+receipt.contractAddress+' gasUsed = '+receipt.gasUsed))
      .on('receipt', receipt=> receiptCallback && receiptCallback(receipt))
      .then(_=>new AccessOnly(_)) 
  }

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'AccessOnly'
  }

  /**
   * This is a readonly constant function.
   *
   * @param {string} _interfaceID - the interfaceID
   * @returns {Promise<boolean>}  - a Promise for the return value
   *
   */
  supportsInterface(_interfaceID:string):Promise<boolean> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[0])
    return this.contract.methods.supportsInterface(...arguments).call().then(_=>validateCallResult(_,AccessOnly.abi[0]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  PROP_BOOKING_OFFCHAIN():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[1])
    return this.contract.methods.PROP_BOOKING_OFFCHAIN(...arguments).call().then(_=>validateCallResult(_,AccessOnly.abi[1]))
  }

  /**
   * This function requries a transaction.
   *
   * @param {string} id - the id
   * @param {string} user - the user
   * @param {boolean} hasAccess - the hasAccess
   *
   */
  setAccessWhitelist(id:string, user:string, hasAccess:boolean, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[2])
    log('debug',color.green('AccessOnly.setAccessWhitelist')+color.blackBright('(id='+id+', user='+user+', hasAccess='+hasAccess+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setAccessWhitelist(id, user, hasAccess).send(txargs||{...defTx})
      .on('error', error=>log('error','AccessOnly.setAccessWhitelist : '+error.message,error))
      .on('transactionHash', txh=>log('debug','AccessOnly.setAccessWhitelist : txhash = '+txh))
      .on('receipt', receipt=>log('debug','AccessOnly.setAccessWhitelist : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  PROP_IDENTITY_REQUIRED():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[3])
    return this.contract.methods.PROP_IDENTITY_REQUIRED(...arguments).call().then(_=>validateCallResult(_,AccessOnly.abi[3]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ens():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[4])
    return this.contract.methods.ens(...arguments).call().then(_=>validateCallResult(_,AccessOnly.abi[4]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  PROP_BOOKING_ONCHAIN():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[5])
    return this.contract.methods.PROP_BOOKING_ONCHAIN(...arguments).call().then(_=>validateCallResult(_,AccessOnly.abi[5]))
  }

  /**
   * This is a readonly constant function.
   *
   * @param {string} id - the id
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  meta(id:string):Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[6])
    return this.contract.methods.meta(...arguments).call().then(_=>validateCallResult(_,AccessOnly.abi[6]))
  }

  /**
   * This is a readonly constant function.
   *
   * @param {string} key1 - the
   * @returns {Promise<BN>}  - a Promise for the return value
   * @returns {Promise<BN>}  - a Promise for the return value
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  registry(key1:string):Promise<{props:BN,extra:BN,meta:string}> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[7])
    return this.contract.methods.registry(...arguments).call().then(_=>validateCallResult(_,AccessOnly.abi[7]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  PROP_RENTABLE():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[8])
    return this.contract.methods.PROP_RENTABLE(...arguments).call().then(_=>validateCallResult(_,AccessOnly.abi[8]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  owner():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[9])
    return this.contract.methods.owner(...arguments).call().then(_=>validateCallResult(_,AccessOnly.abi[9]))
  }

  /**
   * This function requries a transaction.
   *
   * @param {string} _id - the id
   * @param {string} _meta - the meta
   * @param {BN|number|string} props - the props
   *
   */
  setObject(_id:string, _meta:string, props:BN|number|string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[10])
    log('debug',color.green('AccessOnly.setObject')+color.blackBright('(_id='+_id+', _meta='+_meta+', props='+props+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.setObject(_id, _meta, props).send(txargs||{...defTx})
      .on('error', error=>log('error','AccessOnly.setObject : '+error.message,error))
      .on('transactionHash', txh=>log('debug','AccessOnly.setObject : txhash = '+txh))
      .on('receipt', receipt=>log('debug','AccessOnly.setObject : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  ACCESS_ONLY():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[11])
    return this.contract.methods.ACCESS_ONLY(...arguments).call().then(_=>validateCallResult(_,AccessOnly.abi[11]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  BloomConstant():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[13])
    return this.contract.methods.BloomConstant(...arguments).call().then(_=>validateCallResult(_,AccessOnly.abi[13]))
  }

  /**
   * `owner` can step down and assign some other address to this role
   *
   * This function requries a transaction.
   *
   * @param {string} _newOwner - The address of the new owner. 0x0 can be used to create  an unowned neutral vault, however that cannot be undone
   *
   */
  changeOwner(_newOwner:string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[14])
    log('debug',color.green('AccessOnly.changeOwner')+color.blackBright('(_newOwner='+_newOwner+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.changeOwner(_newOwner).send(txargs||{...defTx})
      .on('error', error=>log('error','AccessOnly.changeOwner : '+error.message,error))
      .on('transactionHash', txh=>log('debug','AccessOnly.changeOwner : txhash = '+txh))
      .on('receipt', receipt=>log('debug','AccessOnly.changeOwner : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  PROP_STATECHANNEL():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[16])
    return this.contract.methods.PROP_STATECHANNEL(...arguments).call().then(_=>validateCallResult(_,AccessOnly.abi[16]))
  }

  /**
   * This is a readonly constant function.
   *
   * @param {string} id - the id
   * @returns {Promise<BN>}  - a Promise for the return value
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  properties(id:string):Promise<{props:BN,extra:BN}> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[17])
    return this.contract.methods.properties(...arguments).call().then(_=>validateCallResult(_,AccessOnly.abi[17]))
  }

  /**
   * This is a readonly constant function.
   *
   * @param {string} key1 - the
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  deviceOwner(key1:string):Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[18])
    return this.contract.methods.deviceOwner(...arguments).call().then(_=>validateCallResult(_,AccessOnly.abi[18]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  PROP_REFUND():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[19])
    return this.contract.methods.PROP_REFUND(...arguments).call().then(_=>validateCallResult(_,AccessOnly.abi[19]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  PROP_CONTRACT_EXEC():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[20])
    return this.contract.methods.PROP_CONTRACT_EXEC(...arguments).call().then(_=>validateCallResult(_,AccessOnly.abi[20]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  PROP_EXTEND_TIME():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[21])
    return this.contract.methods.PROP_EXTEND_TIME(...arguments).call().then(_=>validateCallResult(_,AccessOnly.abi[21]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  rootNode():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,AccessOnly.abi[22])
    return this.contract.methods.rootNode(...arguments).call().then(_=>validateCallResult(_,AccessOnly.abi[22]))
  }

  /**
   * subsribes for incoming events.
   *
   * @param {string} fixFilter - the fixFilter
   * @param {string} id - the id
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeLogDeviceChanged(options?: { filter?: {fixFilter?:string , id?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ fixFilter?:string , id?:string , endId?:string  }> {
    return this.contract.events.LogDeviceChanged(options)
  }

  /**
   * read PastEvents.
   *
   * @param {string} fixFilter - the fixFilter
   * @param {string} id - the id
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getLogDeviceChanged(options?: { filter?: {fixFilter?:string , id?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ fixFilter?:string , id?:string , endId?:string  }>[]> {
    return (<any>this.contract).getPastEvents('LogDeviceChanged',options)
  }

  /**
   * subsribes for incoming events.
   *
   * @param {string} id - the id
   * @param {string} controller - the controller
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeLogAccessChanged(options?: { filter?: {id?:string , controller?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ id?:string , controller?:string , permission?:boolean  }> {
    return this.contract.events.LogAccessChanged(options)
  }

  /**
   * read PastEvents.
   *
   * @param {string} id - the id
   * @param {string} controller - the controller
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getLogAccessChanged(options?: { filter?: {id?:string , controller?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ id?:string , controller?:string , permission?:boolean  }>[]> {
    return (<any>this.contract).getPastEvents('LogAccessChanged',options)
  }

  /**
   * subsribes for incoming events.
   *
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeLogChangeOwner(options?: { filter?: {}, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ _newOwner?:string  }> {
    return this.contract.events.LogChangeOwner(options)
  }

  /**
   * read PastEvents.
   *
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getLogChangeOwner(options?: { filter?: {}, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ _newOwner?:string  }>[]> {
    return (<any>this.contract).getPastEvents('LogChangeOwner',options)
  }

  subscribeAllEvents(options?: { filter?: any, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter {
    return this.contract.events.allEvents(options)
  }

  getAllEvents(options?: { filter?: any, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): Promise<EventLog[]> {
    return (<any>this.contract).getPastEvents('allEvents',options)
  }

}

}



export namespace interfaces {

/**
 */
export class EIP165 {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {EIP165} the EIP165
   *
   */
  static at(address:string, web3?:Web3):EIP165 {  // tslint:disable-line:function-name
   return new EIP165( new (web3||defWeb3).eth.Contract( EIP165.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[{name:'_interfaceID',type:'bytes4'}],name:'supportsInterface',outputs:[{name:'',type:'bool'}],payable:false,stateMutability:'view',type:'function'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'EIP165'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * checks, if the contract supports a certain feature by implementing the interface
   *
   * This is a readonly constant function.
   *
   * @param {string} _interfaceID - the hash or identifier of the interface
   * @returns {Promise<boolean>}  - a Promise for the return value
   *
   */
  supportsInterface(_interfaceID:string):Promise<boolean> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,EIP165.abi[0])
    return this.contract.methods.supportsInterface(...arguments).call().then(_=>validateCallResult(_,EIP165.abi[0]))
  }

}

}



export namespace interfaces {

/**
 */
export class ERC20 {

  /**
   * the list of inherited contractNames 
   *
   * @returns {string[]} the names of the contracts
   *
   */
  static get inherits():{name:string, at:(address:string)=>any}[] {
    return []
  }

  /**
   * get a Contract at the given address. 
   *
   * @param {string} address - the address of the contract.
   * @param {string} web3 - the web3-object to use (optional).
   * @returns {ERC20} the ERC20
   *
   */
  static at(address:string, web3?:Web3):ERC20 {  // tslint:disable-line:function-name
   return new ERC20( new (web3||defWeb3).eth.Contract( ERC20.abi, address) )
  }

  /**
   * get the abi of a Contract 
   *
   * @returns {ABIDefintion[]} the abi
   *
   */
  static get abi():ABIDefinition[] {
    return [{constant:true,inputs:[],name:'name',outputs:[{name:'',type:'string'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'_spender',type:'address'},{name:'_value',type:'uint256'}],name:'approve',outputs:[{name:'_success',type:'bool'}],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[],name:'totalSupply',outputs:[{name:'_totalSupply',type:'uint256'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'_from',type:'address'},{name:'_to',type:'address'},{name:'_value',type:'uint256'}],name:'transferFrom',outputs:[{name:'_success',type:'bool'}],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[],name:'decimals',outputs:[{name:'',type:'uint8'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[{name:'_owner',type:'address'}],name:'balanceOf',outputs:[{name:'_balance',type:'uint256'}],payable:false,stateMutability:'view',type:'function'},{constant:true,inputs:[],name:'symbol',outputs:[{name:'',type:'string'}],payable:false,stateMutability:'view',type:'function'},{constant:false,inputs:[{name:'_to',type:'address'},{name:'_value',type:'uint256'}],name:'transfer',outputs:[{name:'_success',type:'bool'}],payable:false,stateMutability:'nonpayable',type:'function'},{constant:true,inputs:[{name:'_owner',type:'address'},{name:'_spender',type:'address'}],name:'allowance',outputs:[{name:'_remaining',type:'uint256'}],payable:false,stateMutability:'view',type:'function'},{anonymous:false,inputs:[{indexed:true,name:'_from',type:'address'},{indexed:true,name:'_to',type:'address'},{indexed:false,name:'_value',type:'uint256'}],name:'Transfer',type:'event'},{anonymous:false,inputs:[{indexed:true,name:'_owner',type:'address'},{indexed:true,name:'_spender',type:'address'},{indexed:false,name:'_value',type:'uint256'}],name:'Approval',type:'event'}]
  }

  /**
   * constructor with a existing contract as param. 
   *
   * @param {Contract} contract - the contract.
   *
   */
  constructor(contract:Contract) {
    this.contract = contract
  }

  contract: Contract

  /**
   * get the name of the contract. 
   *
   * @returns {string} the name
   *
   */
  get contractName():string {
    return 'ERC20'
  }

  /**
   * get the address of the contract. 
   *
   * @returns {string} the address
   *
   */
  get address():string {
    return this.contract.options.address  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  name():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,ERC20.abi[0])
    return this.contract.methods.name(...arguments).call().then(_=>validateCallResult(_,ERC20.abi[0]))
  }

  /**
   * This function requries a transaction.
   *
   * @param {string} _spender - the spender
   * @param {BN|number|string} _value - the value
   * @returns {Promise<boolean>}  - a Promise for the return value
   *
   */
  approve(_spender:string, _value:BN|number|string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,ERC20.abi[1])
    log('debug',color.green('ERC20.approve')+color.blackBright('(_spender='+_spender+', _value='+_value+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.approve(_spender, _value).send(txargs||{...defTx})
      .on('error', error=>log('error','ERC20.approve : '+error.message,error))
      .on('transactionHash', txh=>log('debug','ERC20.approve : txhash = '+txh))
      .on('receipt', receipt=>log('debug','ERC20.approve : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  totalSupply():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,ERC20.abi[2])
    return this.contract.methods.totalSupply(...arguments).call().then(_=>validateCallResult(_,ERC20.abi[2]))
  }

  /**
   * This function requries a transaction.
   *
   * @param {string} _from - the from
   * @param {string} _to - the to
   * @param {BN|number|string} _value - the value
   * @returns {Promise<boolean>}  - a Promise for the return value
   *
   */
  transferFrom(_from:string, _to:string, _value:BN|number|string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,ERC20.abi[3])
    log('debug',color.green('ERC20.transferFrom')+color.blackBright('(_from='+_from+', _to='+_to+', _value='+_value+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.transferFrom(_from, _to, _value).send(txargs||{...defTx})
      .on('error', error=>log('error','ERC20.transferFrom : '+error.message,error))
      .on('transactionHash', txh=>log('debug','ERC20.transferFrom : txhash = '+txh))
      .on('receipt', receipt=>log('debug','ERC20.transferFrom : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  decimals():Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,ERC20.abi[4])
    return this.contract.methods.decimals(...arguments).call().then(_=>validateCallResult(_,ERC20.abi[4]))
  }

  /**
   * This is a readonly constant function.
   *
   * @param {string} _owner - the owner
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  balanceOf(_owner:string):Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,ERC20.abi[5])
    return this.contract.methods.balanceOf(...arguments).call().then(_=>validateCallResult(_,ERC20.abi[5]))
  }

  /**
   * This is a readonly constant function.
   *
   * @returns {Promise<string>}  - a Promise for the return value
   *
   */
  symbol():Promise<string> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,ERC20.abi[6])
    return this.contract.methods.symbol(...arguments).call().then(_=>validateCallResult(_,ERC20.abi[6]))
  }

  /**
   * This function requries a transaction.
   *
   * @param {string} _to - the to
   * @param {BN|number|string} _value - the value
   * @returns {Promise<boolean>}  - a Promise for the return value
   *
   */
  transfer(_to:string, _value:BN|number|string, txargs?:Tx):PromiEvent<TransactionReceipt> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,ERC20.abi[7])
    log('debug',color.green('ERC20.transfer')+color.blackBright('(_to='+_to+', _value='+_value+') to '+this.address+'  '+JSON.stringify(txargs||defTx)))
    return this.contract.methods.transfer(_to, _value).send(txargs||{...defTx})
      .on('error', error=>log('error','ERC20.transfer : '+error.message,error))
      .on('transactionHash', txh=>log('debug','ERC20.transfer : txhash = '+txh))
      .on('receipt', receipt=>log('debug','ERC20.transfer : confirmed with gasUsed : '+receipt.gasUsed + ' events: '+formatEvents(receipt.events) ))
  }

  /**
   * This is a readonly constant function.
   *
   * @param {string} _owner - the owner
   * @param {string} _spender - the spender
   * @returns {Promise<BN>}  - a Promise for the return value
   *
   */
  allowance(_owner:string, _spender:string):Promise<BN> {         // eslint-disable-line no-unused-vars
    validateArguments(arguments,ERC20.abi[8])
    return this.contract.methods.allowance(...arguments).call().then(_=>validateCallResult(_,ERC20.abi[8]))
  }

  /**
   * subsribes for incoming events.
   *
   * @param {string} _from - the from
   * @param {string} _to - the to
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeTransfer(options?: { filter?: {_from?:string , _to?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ _from?:string , _to?:string , _value?:BN|number|string  }> {
    return this.contract.events.Transfer(options)
  }

  /**
   * read PastEvents.
   *
   * @param {string} _from - the from
   * @param {string} _to - the to
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getTransfer(options?: { filter?: {_from?:string , _to?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ _from?:string , _to?:string , _value?:BN|number|string  }>[]> {
    return (<any>this.contract).getPastEvents('Transfer',options)
  }

  /**
   * subsribes for incoming events.
   *
   * @param {string} _owner - the owner
   * @param {string} _spender - the spender
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  subscribeApproval(options?: { filter?: {_owner?:string , _spender?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter<{ _owner?:string , _spender?:string , _value?:BN|number|string  }> {
    return this.contract.events.Approval(options)
  }

  /**
   * read PastEvents.
   *
   * @param {string} _owner - the owner
   * @param {string} _spender - the spender
   * @param {any} additionalFilter - the additionalFilter
   *
   */
  getApproval(options?: { filter?: {_owner?:string , _spender?:string }, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }) : Promise<EventLog<{ _owner?:string , _spender?:string , _value?:BN|number|string  }>[]> {
    return (<any>this.contract).getPastEvents('Approval',options)
  }

  subscribeAllEvents(options?: { filter?: any, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): EventEmitter {
    return this.contract.events.allEvents(options)
  }

  getAllEvents(options?: { filter?: any, fromBlock?: BlockType, toBlock?: BlockType, topics?: any[] }): Promise<EventLog[]> {
    return (<any>this.contract).getPastEvents('allEvents',options)
  }

}

}

