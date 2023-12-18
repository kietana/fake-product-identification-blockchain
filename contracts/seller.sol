// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

interface IProductManagement_S {
    function verifySeller (string memory _sellerId) external view returns (bool);
    function changeProductOwner(uint _productId, address _new) external;
    function getProductData(uint _productId) external view returns (string memory _name, string memory _size, string memory _origin, uint _price, address payable _owner, uint year, uint month, uint date);
    function getSellerData(string memory _sellerId) external view returns (string memory _shopName, bool _isSeller, address _sellerAddr);
}

contract Seller {

    event log(string message);

    IProductManagement_S productManageContract;
    
    mapping (address => uint) private balance; // mapping to keep track of each seller topped up balance

    constructor (address _productManageAddress) {
        productManageContract = IProductManagement_S(_productManageAddress);
    }

    modifier onlySeller(string memory _sellerId) {
        require(productManageContract.verifySeller(_sellerId));
        _;
    }

    fallback() external payable {
        emit log("fallback");
    }

    receive() external payable { // msg.sender dari receive function adalah contract ini sendiri
        emit log("receive");
    }

    function topUp (string memory _sellerId) public payable onlySeller(_sellerId) {
        require(msg.value > 0 ether);

        address sellerAddr;
        (,, sellerAddr) = productManageContract.getSellerData(_sellerId);
        balance[sellerAddr] += msg.value; // msg.value is in wei

        (bool sent,) = payable(address(this)).call{value: msg.value}("");
        require(sent, "Fail to top up amount.");
        
    }

    function checkBalance (string memory _sellerId) public view onlySeller(_sellerId) returns (uint) {
        address sellerAddr;
        (,, sellerAddr) = productManageContract.getSellerData(_sellerId);
        return balance[sellerAddr];
    }

    function buyFromManufacturer(string memory _from, uint _productId) public payable onlySeller(_from) { // _from is seller id
        uint price;
        address payable _to; // product owner that we want to pay eth to
        address sellerAddr;

        (,, sellerAddr) = productManageContract.getSellerData(_from);

        (,,, price, _to,,,) = productManageContract.getProductData(_productId);

        require(balance[sellerAddr] >= price, "Balance not enough");

        balance[sellerAddr] -= price * 10**18; // must ensure the unit is in wei
        (bool sent, ) = _to.call{value: price * 10**18 }("");
        require(sent, "Failed to send Ether");
        
        productManageContract.changeProductOwner(_productId, sellerAddr);
    }

    // function setNewPrice(uint _productId, uint _price) internal onlySeller {
    //     IProductManagement.products[_productId].price = _price;
    // }
    
}