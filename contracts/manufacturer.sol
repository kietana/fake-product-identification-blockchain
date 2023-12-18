// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/access/Ownable.sol";

interface IProductManagement {
    function makeProduct(string memory _name, string memory _size, string memory _origin, uint _price, address _newOwner) external;
    function registerSeller(string memory _sellerId, string memory _shopName, address _sellerAddr) external;
    function showSerialNumber (uint _productId) external view returns (uint);
}

contract Manufacturer is Ownable {

    IProductManagement productManageContract;

    constructor (address _productManageAddress, address initOwner) Ownable(initOwner) {
        productManageContract = IProductManagement(_productManageAddress);
    }

    function addProduct (string memory _name, string memory _size, string memory _origin, uint _price) public onlyOwner {
        productManageContract.makeProduct(_name, _size, _origin, _price, msg.sender);
    }

    function addSeller (string memory _sellerId, string memory _shopName, address _sellerAddr) public onlyOwner {
        productManageContract.registerSeller(_sellerId, _shopName, _sellerAddr);
    }

    function showSN(uint _productId) public view returns (uint) {
        return productManageContract.showSerialNumber(_productId);
    }
}