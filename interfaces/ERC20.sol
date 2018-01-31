pragma solidity ^0.4.4;

contract ERC20 {
      function totalSupply() public constant returns (uint _totalSupply);
      function balanceOf(address _owner) public constant returns (uint _balance);
      function transfer(address _to, uint _value)  public returns (bool _success);
      function transferFrom(address _from, address _to, uint _value) public returns (bool _success);
      function approve(address _spender, uint _value) public returns (bool _success);
      function allowance(address _owner, address _spender) public constant returns (uint _remaining);
      function name() public constant returns (string);
      function symbol() public constant returns (string);
      function decimals() public constant returns (uint8);
      event Transfer(address indexed _from, address indexed _to, uint _value);
      event Approval(address indexed _owner, address indexed _spender, uint _value);

}