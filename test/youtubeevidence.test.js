const { expectRevert, expectEvent, BN, balance } = require('@openzeppelin/test-helpers');
const chai = require('chai');
chai.use(require('chai-bn')(BN));

const YouTubeEvidence = artifacts.require('YouTubeEvidenceMock');
const Manifestations = artifacts.require("Manifestations");

const MANIFESTATION_HASH1 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
const MANIFESTATION_HASH2 = "QmPP8X2rWc2uanbnKpxfzEAAuHPuThQRtxpoY8CYVJxDj8";
const VALID_VIDEO = "ZwVNLDIJKVA";
const TITLE = "A nice video";
const INVALID_VIDEO = "YwVNLDIJKVB";

contract('YouTube Evidence', function (accounts) {
  const OWNER = accounts[0];
  const MANIFESTER = accounts[1];
  const EVIDENCER = accounts[2];

  let youtubeevidence, manifestations, requestId;

  before('setup contract for all tests', async () => {
    youtubeevidence = await YouTubeEvidence.deployed();
    manifestations = await Manifestations.deployed();
  });

  it("should verify a valid YouTube video for an existing manifestation", async () => {
    await manifestations.manifestAuthorship(MANIFESTATION_HASH1, TITLE, {from: MANIFESTER});
    chai.expect(await manifestations.isUnevidenced(MANIFESTATION_HASH1)).to.be.true;
    chai.expect(await manifestations.getEvidenceCount(MANIFESTATION_HASH1)).to.be.bignumber.equal(new BN(0));

    const res = await youtubeevidence.check(manifestations.address, MANIFESTATION_HASH1, VALID_VIDEO, {from: EVIDENCER});

    expectEvent(res, 'VerificationRequest',
      {evidencedHash: MANIFESTATION_HASH1, videoId: VALID_VIDEO});
    requestId = res.logs[0].args.requestId;
    expectEvent(res, 'YouTubeEvidenceEvent', {requestId: requestId, registry: manifestations.address,
      evidencedHash: MANIFESTATION_HASH1, videoId: VALID_VIDEO, evidencer: EVIDENCER, isVerified: true});

    const evidence = await youtubeevidence.evidences(requestId);
    chai.expect(evidence.isVerified).to.be.true;
    chai.expect(await manifestations.isUnevidenced(MANIFESTATION_HASH1)).to.be.false;
    chai.expect(await manifestations.getEvidenceCount(MANIFESTATION_HASH1)).to.be.bignumber.equal(new BN(1));
  });

  it("shouldn't verify an invalid YouTube video for an existing manifestation", async () => {
    await manifestations.manifestAuthorship(MANIFESTATION_HASH2, TITLE, {from: MANIFESTER});
    chai.expect(await manifestations.isUnevidenced(MANIFESTATION_HASH2)).to.be.true;
    chai.expect(await manifestations.getEvidenceCount(MANIFESTATION_HASH2)).to.be.bignumber.equal(new BN(0));

    const res = await youtubeevidence.check(manifestations.address, MANIFESTATION_HASH2, INVALID_VIDEO, {from: EVIDENCER});

    expectEvent(res, 'VerificationRequest',
      {evidencedHash: MANIFESTATION_HASH2, videoId: INVALID_VIDEO});
    requestId = res.logs[0].args.requestId;
    expectEvent(res, 'YouTubeEvidenceEvent', {requestId: requestId, registry: manifestations.address,
      evidencedHash: MANIFESTATION_HASH2, videoId: INVALID_VIDEO, evidencer: EVIDENCER, isVerified: false});

    const evidence = await youtubeevidence.evidences(requestId);
    chai.expect(evidence.isVerified).to.be.false;
    chai.expect(await manifestations.isUnevidenced(MANIFESTATION_HASH2)).to.be.true;
    chai.expect(await manifestations.getEvidenceCount(MANIFESTATION_HASH2)).to.be.bignumber.equal(new BN(0));
  });

  it("shouldn't allow processing an already processed request", async () => {
    await expectRevert.unspecified(youtubeevidence.processVerification(requestId, true));
  });

  it("shouldn't allow processing an non-existing request", async () => {
    const UNEXISTING_REQUEST_ID = '0x1';
    await expectRevert.unspecified(youtubeevidence.processVerification(UNEXISTING_REQUEST_ID, true));
  });
});
