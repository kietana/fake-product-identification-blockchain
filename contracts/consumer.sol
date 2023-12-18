// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

interface IProductManagement_C {
    function getProductData(uint _productId) external view returns (string memory _name, string memory _size, string memory _origin, uint _price, address payable _owner, uint year, uint month, uint date);
    function changeProductOwner(uint _productId, address _new) external;
}

contract Consumer {

    IProductManagement_C productManageContract;

    mapping (address => bool) public isConsumer;
    mapping (address => uint) private balance; // id => balance mapping to keep track of each consumer topped up balance

    constructor (address _productManageAddress) {
        productManageContract = IProductManagement_C(_productManageAddress);
    }

    fallback() external payable {

    }

    receive() external payable { 
        
    }

    modifier onlyConsumer(address _addr) {
        require(isConsumer[_addr]);
        _;
    }

    function registerConsumer(address _addr) public {
        isConsumer[_addr] = true;
    }

    function topUp (address _addr) public payable onlyConsumer(_addr) {
        require(msg.value > 0 ether);
        (bool sent,) = payable(address(this)).call{value: msg.value}("");
        require(sent, "Fail to top up amount.");

        balance[_addr] += msg.value;
    }

    function checkBalance (address _addr) public view onlyConsumer(_addr) returns (uint) {
        return balance[_addr];
    }

    function buyFromSeller (address _addr, uint _productId) public payable onlyConsumer(_addr) {
        uint price;
        address payable _to; // product owner that we want to pay eth to

        (,,, price, _to,,,) = productManageContract.getProductData(_productId);
        
        require(balance[_addr] >= price, "Balance not enough");

        (bool sent, ) = _to.call{value: price * 10**18}("");
        require(sent, "Failed to send Ether");

        balance[_addr] -= price * 10**18;
        productManageContract.changeProductOwner(_productId, _addr);
    }
    
}