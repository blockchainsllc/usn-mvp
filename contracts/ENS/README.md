* `class` [USNResolvable](#class-usnresolvable)    
* `interface` [AbstractENS](#interface-abstractens)    
* `class` [ENSImpl](#class-ensimpl)    
* `class` [ENSOwner](#class-ensowner)    
    interface used to check for the owner of given ENS-Nodeid    
    
* `class` [USNRegistrar](#class-usnregistrar)    
    this contract may be used to register new names for the usn-domain.    
    
* `class` [USNResolver](#class-usnresolver)    
    the main regstry for all contracts based on the USN-Names    
    
## `class` USNResolvable


See [ENS/USNResolvable.sol](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/USNResolvable.sol)

```javascript
[{"constant":true,"inputs":[],"name":"ens","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"subNode","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rootNode","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"}]
```

* **constructor** ()

* function **ens** ()     
    constant returns (`address`)    
    the ENS-address 
* function **rootNode** ()     
    constant returns (`bytes32`)    
    the rootNode pointing to the hash of `usn.eth` 
* function **subNode** ()     
    constant returns (`bytes32`)    
    the nodeId 

## `interface` AbstractENS


See [ENS/AbstractENS.sol](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/AbstractENS.sol)

```javascript
[{"constant":true,"inputs":[{"name":"_node","type":"bytes32"}],"name":"resolver","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_node","type":"bytes32"}],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_node","type":"bytes32"},{"name":"_label","type":"bytes32"},{"name":"_owner","type":"address"}],"name":"setSubnodeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_node","type":"bytes32"},{"name":"_ttl","type":"uint64"}],"name":"setTTL","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_node","type":"bytes32"}],"name":"ttl","outputs":[{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_node","type":"bytes32"},{"name":"_resolver","type":"address"}],"name":"setResolver","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_node","type":"bytes32"},{"name":"_owner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_node","type":"bytes32"},{"indexed":true,"name":"_label","type":"bytes32"},{"indexed":false,"name":"_owner","type":"address"}],"name":"NewOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_node","type":"bytes32"},{"indexed":false,"name":"_owner","type":"address"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_node","type":"bytes32"},{"indexed":false,"name":"_resolver","type":"address"}],"name":"NewResolver","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_node","type":"bytes32"},{"indexed":false,"name":"_ttl","type":"uint64"}],"name":"NewTTL","type":"event"}]
```

* **constructor** ()
* event **NewOwner** (`bytes32indexed _node`, `bytes32indexed _label`, `address _owner`)     
    Logged when the owner of a node assigns a new owner to a subnode.
* event **Transfer** (`bytes32indexed _node`, `address _owner`)     
    Logged when the owner of a node transfers ownership to a new account.
* event **NewResolver** (`bytes32indexed _node`, `address _resolver`)     
    Logged when the resolver for a node changes.
* event **NewTTL** (`bytes32indexed _node`, `uint64 _ttl`)     
    Logged when the TTL of a node changes

* function **owner** (`bytes32 _node`)     
    constant returns (`address`) 
* function **resolver** (`bytes32 _node`)     
    constant returns (`address`) 
* function **setOwner** (`bytes32 _node`, `address _owner`)     
     
* function **setResolver** (`bytes32 _node`, `address _resolver`)     
     
* function **setSubnodeOwner** (`bytes32 _node`, `bytes32 _label`, `address _owner`)     
     
* function **setTTL** (`bytes32 _node`, `uint64 _ttl`)     
     
* function **ttl** (`bytes32 _node`)     
    constant returns (`uint64`) 

## `class` ENSImpl

> is [AbstractENS](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/README.md#interface-abstractens)    


See [ENS/ENSImpl.sol](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/ENSImpl.sol)

```javascript
[{"constant":true,"inputs":[{"name":"_node","type":"bytes32"}],"name":"resolver","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_node","type":"bytes32"}],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_node","type":"bytes32"},{"name":"_label","type":"bytes32"},{"name":"_owner","type":"address"}],"name":"setSubnodeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_node","type":"bytes32"},{"name":"_ttl","type":"uint64"}],"name":"setTTL","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_node","type":"bytes32"}],"name":"ttl","outputs":[{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_node","type":"bytes32"},{"name":"_resolver","type":"address"}],"name":"setResolver","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_node","type":"bytes32"},{"name":"_owner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_node","type":"bytes32"},{"indexed":true,"name":"_label","type":"bytes32"},{"indexed":false,"name":"_owner","type":"address"}],"name":"NewOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_node","type":"bytes32"},{"indexed":false,"name":"_owner","type":"address"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_node","type":"bytes32"},{"indexed":false,"name":"_resolver","type":"address"}],"name":"NewResolver","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_node","type":"bytes32"},{"indexed":false,"name":"_ttl","type":"uint64"}],"name":"NewTTL","type":"event"}]
```

* **constructor** ()


## `class` ENSOwner

interface used to check for the owner of given ENS-Nodeid
See [ENS/ENSOwner.sol](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/ENSOwner.sol)

```javascript
[{"constant":true,"inputs":[],"name":"ens","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_nodeId","type":"bytes32"}],"name":"getENSOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_ens","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
```

* **constructor** (`address _ens`)

* function **ens** ()     
    constant returns (`address`)    
    @notice The Constructor stores the address of the ENS value= _ens 
* function **getENSOwner** (`bytes32 _nodeId`)     
    constant returns (`address`) 

## `class` USNRegistrar

> is [Owned](https://github.com/slockit/usn-lib/blob/develop/contracts/interfaces/README.md#class-owned)    

this contract may be used to register new names for the usn-domain.
See [ENS/USNRegistrar.sol](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/USNRegistrar.sol)

```javascript
[{"constant":true,"inputs":[],"name":"difficulty","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ens","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"resolver","type":"address"}],"name":"setResolver","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newRegistrar","type":"address"}],"name":"updateRegistrar","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"val","type":"uint256"}],"name":"setDifficulty","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_subnode","type":"bytes32"},{"name":"_owner","type":"address"}],"name":"registerObject","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_admin","type":"address"}],"name":"setAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"rootNode","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_ens","type":"address"},{"name":"_rootNode","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_newOwner","type":"address"}],"name":"LogChangeOwner","type":"event"}]
```

* **constructor** (`address _ens`, `bytes32 _rootNode`)

* function **difficulty** ()     
    constant returns (`uint256`) 
* function **ens** ()     
    constant returns (`address`) 
* function **registerObject** (`bytes32 _subnode`, `address _owner`)     
     
* function **rootNode** ()     
    constant returns (`bytes32`) 
* function **setAdmin** (`address _admin`)     
     
* function **setDifficulty** (`uint256 val`)     
     
* function **setResolver** (`address resolver`)     
     
* function **updateRegistrar** (`address _newRegistrar`)     
     

## `class` USNResolver

> is [Owned](https://github.com/slockit/usn-lib/blob/develop/contracts/interfaces/README.md#class-owned)    

the main regstry for all contracts based on the USN-Names
See [ENS/USNResolver.sol](https://github.com/slockit/usn-lib/blob/develop/contracts/ENS/USNResolver.sol)

```javascript
[{"constant":true,"inputs":[{"name":"_interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"_nodeID","type":"bytes32"}],"name":"addrAndChain","outputs":[{"name":"contractAddress","type":"address"},{"name":"chainId","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"getCodeAt","outputs":[{"name":"o_code","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"isWhitelisted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_nodeID","type":"bytes32"}],"name":"addr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ens","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_codeHash","type":"bytes32"},{"name":"_allow","type":"bool"}],"name":"setWhitelistedCode","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_subnode","type":"bytes32"},{"name":"_newAddress","type":"address"},{"name":"_chainIPFS","type":"bytes32"}],"name":"setAddressInChain","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"chain","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"bytes4"},{"name":"_lib","type":"address"}],"name":"setLib","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_allow","type":"bool"}],"name":"setWhitelisted","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"whitelist","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"objects","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_subnode","type":"bytes32"},{"name":"newContract","type":"address"}],"name":"setAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes4"}],"name":"config","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"bytes4"},{"name":"_val","type":"string"}],"name":"setConfig","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes4"}],"name":"lib","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rootNode","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_ens","type":"address"},{"name":"_rootNode","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_type","type":"bytes32"},{"indexed":false,"name":"_allowed","type":"bool"}],"name":"LogWhiteListUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_type","type":"bytes4"},{"indexed":false,"name":"newAddress","type":"address"}],"name":"LogLibUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_type","type":"bytes4"},{"indexed":false,"name":"val","type":"string"}],"name":"LogConfigUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_nodeID","type":"bytes32"}],"name":"LogAddedObject","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_nodeID","type":"bytes32"}],"name":"LogRemovedObject","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"a","type":"address"}],"name":"AddrChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_newOwner","type":"address"}],"name":"LogChangeOwner","type":"event"}]
```

* **constructor** (`address _ens`, `bytes32 _rootNode`)
* event **LogWhiteListUpdated** (`bytes32 _type`, `bool _allowed`)     
    triggered whenever a new contract-code is added to the whitelist
* event **LogLibUpdated** (`bytes4 _type`, `address newAddress`)     
    triggered whenever a library was updated
* event **LogConfigUpdated** (`bytes4 _type`, `string val`)     
    triggered whenever a config was updated
* event **LogAddedObject** (`bytes32 _nodeID`)     
    triggered when a new Object-contract has been added
* event **LogRemovedObject** (`bytes32 _nodeID`)     
    triggered when a object-contract has been removed
* event **AddrChanged** (`bytes32indexed node`, `address a`)     
    triggers a event whenever a address changes. See ENS-Resolver in EIP-137

* function **addr** (`bytes32 _nodeID`)     
    constant returns (`address`)    
    resolves the address for the given nodeid
    * _nodeID : the hash of of the rootNode+ hash of the name 
* function **addrAndChain** (`bytes32 _nodeID`)     
    constant returns (`address contractAddress`, `bytes32 chainId`)    
    resolves the address and the chain for the given nodeid this function is simply used to reduce the number of calls, because in order to resolve a nodeId, you always need to get both values (address and chain)
    * _nodeID : the hash of of the rootNode+ hash of the name 
* function **chain** (`bytes32`)     
    constant returns (`bytes32`)    
    mapping of the nodeid to a IPFS-Hash, which describes the chain this contract is deployed. 
* function **config** (`bytes4`)     
    constant returns (`string`)    
    public config-mapping 
* function **ens** ()     
    constant returns (`address`)    
    the ENS-address 
* function **getCodeAt** (`address _addr`)     
    constant returns (`bytes o_code`)    
    returns the code for a given address 
* function **isWhitelisted** (`address _address`)     
    constant returns (`bool`)    
    returns true, if the code of the given address would be whitelisted
    * _address : the address of the deployed contract 
* function **lib** (`bytes4`)     
    constant returns (`address`)    
    public libraries-mapping 
* function **objects** (`bytes32`)     
    constant returns (`address`)    
    mapping of the nodeid to the contract address 
* function **rootNode** ()     
    constant returns (`bytes32`)    
    the rootNode pointing to the hash of `usn.eth` 
* function **setAddress** (`bytes32 _subnode`, `address newContract`)     
        
    changes the address of existing or new contract.
    * _subnode : the hash of the name registered
    * newContract : the address of the contract 
* function **setAddressInChain** (`bytes32 _subnode`, `address _newAddress`, `bytes32 _chainIPFS`)     
        
    sets or changes a address for a contract, which is not deployed in the same chain.
    * _chainIPFS : the IPFS-Hash of the chain-defintion
    * _newAddress : the address of the contract
    * _subnode : the hash of the name registered 
* function **setConfig** (`bytes4 _id`, `string _val`)     
        
    sets a config-entry
    * _id : the hash or id of the entry
    * _val : the value 
* function **setLib** (`bytes4 _id`, `address _lib`)     
        
    sets a library-contract
    * _id : the hash or id of the interface
    * _lib : the address 
* function **setWhitelisted** (`address _address`, `bool _allow`)     
        
    whitelists the code of existing contract
    * _address : the address of the deployed contract
    * _allow : flag indicating if this should be allowed or not 
* function **setWhitelistedCode** (`bytes32 _codeHash`, `bool _allow`)     
        
    whitelists the code of not deployed contract
    * _allow : flag indicating if this should be allowed or not
    * _codeHash : the runtime-bin-hash of the contract 
* function **supportsInterface** (`bytes4 _interfaceID`)     
    constant returns (`bool`)    
    returns true if the given interface is supported
    * _interfaceID : the 4 bytes-hash of the interface 
* function **whitelist** (`bytes32`)     
    constant returns (`bool`)    
    all contracts in types are whitelisted 

