const Manifestations = artifacts.require("./Manifestations.sol");
const YouTubeEvidence = artifacts.require("./YouTubeEvidence.sol");
const YouTubeEvidenceMock = artifacts.require("./YouTubeEvidenceMock.sol");

module.exports = async function(deployer, network, accounts) {
  const owner = accounts[0];
  let youTubeEvidence;

  deployer.then(async () => {
    if (network === "development") {
      await deployer.deploy(YouTubeEvidenceMock, {from: owner});
      youTubeEvidence = await YouTubeEvidenceMock.deployed();
    } else {
      await deployer.deploy(YouTubeEvidence, {from: owner});
      youTubeEvidence = await YouTubeEvidence.deployed();
    }
    const manifestations = await Manifestations.deployed();
    await manifestations.addEvidenceProvider(youTubeEvidence.address, {from: owner});
  });
};
