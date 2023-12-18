var Manufacturer = artifacts.require("Manufacturer");
var ProductManagement = artifacts.require("ProductManagement");
// const ownerAddress = '0xa122749a21F0E8c7D7a7D9d76F79FBB9E9524c77';

module.exports = async function(deployer, network, accounts) {
    const deployerAddress = accounts[0];
    await deployer.deploy(Manufacturer, ProductManagement.address, deployerAddress);
};

// module.exports = function(deployer) {
//     deployer.deploy(Manufacturer, ProductManagement.address, ownerAddress);
// };