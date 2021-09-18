const Manifestations = artifacts.require("./Manifestations.sol");
const YouTubeEvidence = artifacts.require("./YouTubeEvidence.sol");

module.exports = async function(deployer, network, accounts) {
  const owner = accounts[0];

  await deployer.deploy(YouTubeEvidence, {from: owner});
  const youTubeEvidence = await YouTubeEvidence.deployed();
  const manifestations = await Manifestations.deployed();

  await manifestations.addEvidenceProvider(youTubeEvidence.address, {from: owner});
};
