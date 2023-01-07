const Manifestations = artifacts.require("./Manifestations.sol");
const ExpirableLib = artifacts.require("./ExpirableLib.sol");
const UploadEvidences = artifacts.require("./UploadEvidence.sol");
const CLYToken = artifacts.require("./CLYToken.sol");

module.exports = async function(deployer, network, accounts) {
  const OWNER = accounts[0];
  const EXPIRY_TIME = 60 * 60 * 24;  // 24h
  const RESERVE_RATIO = 500000; // 1/2 in ppm, CLY price = totalSupply * (1 + amount/poolBalance)^1/2 - totalSupply
  const INITIAL_SLOPE = 1;      // Initial curve slope m when pool balance = 0
  const MAX_GASPRICE = web3.utils.toWei('100', 'gwei');

  await deployer.deploy(ExpirableLib, {from: OWNER});
  await deployer.link(ExpirableLib, [Manifestations], {from: OWNER});
  await deployer.deploy(Manifestations, EXPIRY_TIME, {from: OWNER});
  await deployer.deploy(UploadEvidences, {from: OWNER});
  await deployer.deploy(CLYToken, RESERVE_RATIO, INITIAL_SLOPE, MAX_GASPRICE, {from: OWNER})

  const manifestations = await Manifestations.deployed();
  const uploadEvidences = await UploadEvidences.deployed();
  const clytoken = await CLYToken.deployed();
  await manifestations.addEvidenceProvider(uploadEvidences.address, {from: OWNER});
  await manifestations.setToken(clytoken.address, {from: OWNER});
};
