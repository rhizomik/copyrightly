const Manifestations = artifacts.require("./Manifestations.sol");
const CopyrightLYNFT = artifacts.require("./CopyrightLYNFT.sol");

module.exports = async function(deployer, network, accounts) {
  const owner = accounts[0];

  const manifestations = await Manifestations.deployed();
  await deployer.deploy(CopyrightLYNFT, manifestations.address, {from: owner});
};
