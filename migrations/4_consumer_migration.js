var Consumer = artifacts.require("Consumer");
var ProductManagement = artifacts.require("ProductManagement");

// module.exports = async function(deployer, network, accounts) {
//     const deployerAddress = accounts[0];
//     await deployer.deploy(Manufacturer, ProductManagement.address, deployerAddress);
// };

module.exports = function(deployer) {
    deployer.deploy(Consumer, ProductManagement.address);
};