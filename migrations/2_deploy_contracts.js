const Manifestations = artifacts.require("./Manifestations.sol");
const SafeMath = artifacts.require("./SafeMath.sol");
const ExpirableLib = artifacts.require("./ExpirableLib.sol");
const UploadEvidences = artifacts.require("./UploadEvidence.sol");

module.exports = async function(deployer, network, accounts) {
  const owner = accounts[0];
  const timeToExpiry = 60 * 60 * 24;  // 24h

  await deployer.deploy(SafeMath);
  await deployer.link(SafeMath, [ExpirableLib, Manifestations]);
  await deployer.deploy(ExpirableLib);
  await deployer.link(ExpirableLib, [Manifestations]);
  await deployer.deploy(Manifestations, timeToExpiry);
  await deployer.deploy(UploadEvidences);

  const manifestations = await Manifestations.deployed();
  const uploadEvidences = await UploadEvidences.deployed();
  await manifestations.addEvidenceProvider(uploadEvidences.address);
};
