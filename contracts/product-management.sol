// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./BokkyPooBahsDateTimeLibrary.sol";

contract ProductManagement is Ownable {

    constructor(address initOwner) Ownable(initOwner) {
        
    }

    event NewProduct(string name, uint price);
    event NewSeller(string sellerId, string shopName);

    struct Product {
        string name;
        string size;
        string origin;
        uint price;
        uint year;
        uint month;
        uint date;
    }

    struct SellerData {
        string sellerId;
        string shopName;
        bool isSeller;
        address sellerAddr;
    }

    uint private snDigits = 8;
    uint private modulus = 10 ** snDigits;
    uint private order = 1;

    Product[] public products;
    
    mapping(string => SellerData) public sellers; // sellerId => SellerData
    mapping(address => bool) public isSellerAddr;

    mapping(uint => uint) public serialToProduct; // serial num => Product Id
    mapping (uint => uint) private productToSerial; // product Id => serial num

    mapping(uint => address) public productToOwner; // any address: either manufacturer, seller, or consumer can be an owner
    mapping(address => uint) public ownerProductCount;

   
    function _getCurrentTimestamp() private view returns (uint256) {
        return block.timestamp;
    } 

    function timestampToDate(uint timestamp) private pure returns (uint year, uint month, uint date) {
        (year, month, date) = BokkyPooBahsDateTimeLibrary.timestampToDate(timestamp);
        return (year, month, date);
    }

    function _genSerialNumber() private returns (uint, uint, uint, uint) {
        uint productTime = _getCurrentTimestamp();
        (uint year, uint month, uint date) = timestampToDate(productTime);
        uint productOrder = order++;

        string memory random = string.concat(Strings.toString(productTime), Strings.toString(productOrder));
        return (1 + uint(keccak256(abi.encodePacked(random))) % modulus, year, month, date);
    }

    function makeProduct(string memory _name, string memory _size, string memory _origin, uint _price, address _newOwner) external {
        (uint randomSN, uint year, uint month, uint date)= _genSerialNumber();

        // check: make sure the serial number is not duplicated

        products.push(Product(_name, _size, _origin, _price, year, month, date));

        uint id = products.length - 1;
        serialToProduct[randomSN]= id;
        productToSerial[id] = randomSN;
        productToOwner[id] = _newOwner;
        ownerProductCount[_newOwner]++;
        
        emit NewProduct(_name, _price);
    }

    function getProductData(uint _productId) external view returns (string memory _name, string memory _size, string memory _origin, uint _price, address payable _owner, uint year, uint month, uint date) {
        return (products[_productId].name, products[_productId].size, products[_productId].origin, products[_productId].price, payable(productToOwner[_productId]), year, month, date);
    }

    function getTotalProduct() public view returns (uint) {
        return products.length;
    }

    function registerSeller(string memory _sellerId, string memory _shopName, address _sellerAddr) external {
        require(!sellers[_sellerId].isSeller);

        sellers[_sellerId].sellerId = _sellerId;
        sellers[_sellerId].shopName = _shopName;
        sellers[_sellerId].isSeller = true;
        sellers[_sellerId].sellerAddr = _sellerAddr;
        ownerProductCount[_sellerAddr] = 0;

        isSellerAddr[_sellerAddr] = true;

        emit NewSeller(_sellerId, _shopName);
    }

    function verifySeller(string memory _sellerId) external view returns (bool) {
        return sellers[_sellerId].isSeller;
    }

    function incOwnerProductCount(address _productOwner) external { // increment
        ownerProductCount[_productOwner]++;
    }

    function decOwnerProductCount(address _productOwner) external  {   // decrement
        ownerProductCount[_productOwner]--;
    }

    function changeProductOwner(uint _productId, address _new) external {
        address old = productToOwner[_productId];
        productToOwner[_productId] = _new;
        ownerProductCount[old]--;
        ownerProductCount[_new]++;
    }

    function showSerialNumber (uint _productId) external view returns (uint) { // for manufacturer know only, since SN is not public for everyone to be seen, for testing purpose,
        return productToSerial[_productId];
    }

    function verifyProduct(uint _productSN) public view returns (bool) {
        return _productSN == productToSerial[serialToProduct[_productSN]];
    }
    
    function getSellerData(string memory _sellerId) external view returns (string memory _shopName, bool _isSeller, address _sellerAddr) {
        return (sellers[_sellerId].shopName, sellers[_sellerId].isSeller, sellers[_sellerId].sellerAddr);
    }
}