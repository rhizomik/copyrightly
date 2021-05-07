const Complaints = artifacts.require("./Complaints.sol");
const Manifestations = artifacts.require("./Manifestations.sol");

module.exports = async function (deployer, network, accounts) {
  const owner = accounts[0];

  const manifestations = await Manifestations.deployed();
  await deployer.deploy(Complaints, manifestations.address, {from: owner});
};
