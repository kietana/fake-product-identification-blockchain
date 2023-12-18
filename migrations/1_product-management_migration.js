var ProductManagement = artifacts.require("ProductManagement");
// const ownerAddress = '0xa122749a21F0E8c7D7a7D9d76F79FBB9E9524c77';

// module.exports = function(deployer) {
//     deployer.deploy(Manufacturer, ownerAddress);
// };

module.exports = async function(deployer, network, accounts) {
    const deployerAddress = accounts[0];
    await deployer.deploy(ProductManagement, deployerAddress);
};

// module.exports = function(deployer) {
//     deployer.deploy(ProductManagement, ownerAddress);
// };
