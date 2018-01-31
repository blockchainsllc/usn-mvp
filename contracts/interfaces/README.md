* `interface` [EIP165](#interface-eip165)    
* `class` [Owned](#class-owned)    
* `interface` [Fees](#interface-fees)    
* `interface` [ERC20](#interface-erc20)    
## `interface` EIP165


See [interfaces/EIP165.sol](https://github.com/slockit/usn-lib/blob/develop/contracts/interfaces/EIP165.sol)

```javascript
[{"constant":true,"inputs":[{"name":"_interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]
```

* **constructor** ()

* function **supportsInterface** (`bytes4 _interfaceID`)     
    constant returns (`bool`)    
    checks, if the contract supports a certain feature by implementing the interface
    * _interfaceID : the hash or identifier of the interface 

## `class` Owned


See [interfaces/Owned.sol](https://github.com/slockit/usn-lib/blob/develop/contracts/interfaces/Owned.sol)

```javascript
[{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_newOwner","type":"address"}],"name":"LogChangeOwner","type":"event"}]
```

* **constructor** ()
* event **LogChangeOwner** (`address _newOwner`) 

* function **changeOwner** (`address _newOwner`)     
        
    `owner` can step down and assign some other address to this role
    * _newOwner : The address of the new owner. 0x0 can be used to create  an unowned neutral vault, however that cannot be undone 
* function **owner** ()     
    constant returns (`address`) 

## `interface` Fees


See [interfaces/Fees.sol](https://github.com/slockit/usn-lib/blob/develop/contracts/interfaces/Fees.sol)

```javascript
[{"constant":false,"inputs":[{"name":"price","type":"uint128"},{"name":"token","type":"address"},{"name":"registry","type":"address"},{"name":"user","type":"address"},{"name":"id","type":"bytes32"},{"name":"time","type":"uint64"}],"name":"getAndUpdateFee","outputs":[{"name":"amount","type":"uint128"},{"name":"receiver","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ID","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"price","type":"uint128"},{"name":"token","type":"address"},{"name":"registry","type":"address"},{"name":"user","type":"address"},{"name":"id","type":"bytes32"},{"name":"time","type":"uint64"}],"name":"getFee","outputs":[{"name":"amount","type":"uint128"},{"name":"receiver","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]
```

* **constructor** ()

* function **ID** ()     
    constant returns (`bytes4`)    
    interface-id for supportInterface-check value= 0x9bd12cb7 
* function **getAndUpdateFee** (`uint128 price`, `address token`, `address registry`, `address user`, `bytes32 id`, `uint64 time`)     
     returns (`uint128 amount`, `address receiver`) 
* function **getFee** (`uint128 price`, `address token`, `address registry`, `address user`, `bytes32 id`, `uint64 time`)     
    constant returns (`uint128 amount`, `address receiver`) 

## `interface` ERC20


See [interfaces/ERC20.sol](https://github.com/slockit/usn-lib/blob/develop/contracts/interfaces/ERC20.sol)

```javascript
[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"_totalSupply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"_balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"_remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]
```

* **constructor** ()
* event **Transfer** (`addressindexed _from`, `addressindexed _to`, `uint256 _value`) 
* event **Approval** (`addressindexed _owner`, `addressindexed _spender`, `uint256 _value`) 

* function **allowance** (`address _owner`, `address _spender`)     
    constant returns (`uint256 _remaining`) 
* function **approve** (`address _spender`, `uint256 _value`)     
     returns (`bool _success`) 
* function **balanceOf** (`address _owner`)     
    constant returns (`uint256 _balance`) 
* function **decimals** ()     
    constant returns (`uint8`) 
* function **name** ()     
    constant returns (`string`) 
* function **symbol** ()     
    constant returns (`string`) 
* function **totalSupply** ()     
    constant returns (`uint256 _totalSupply`) 
* function **transfer** (`address _to`, `uint256 _value`)     
     returns (`bool _success`) 
* function **transferFrom** (`address _from`, `address _to`, `uint256 _value`)     
     returns (`bool _success`) 

