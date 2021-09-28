const { expectRevert, expectEvent, BN, constants } = require('@openzeppelin/test-helpers');
const chai = require('chai');
chai.use(require('chai-bn')(BN));

const CopyrightLYNFT = artifacts.require('CopyrightLYNFT');
const CLYToken = artifacts.require('CLYToken');
const YouTubeEvidence = artifacts.require('YouTubeEvidenceMock');
const Manifestations = artifacts.require("Manifestations");

const MANIFESTATION_HASH1 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
const MANIFESTATION_HASH2 = "QmPP8X2rWc2uanbnKpxfzEAAuHPuThQRtxpoY8CYVJxDj8";
const MANIFESTATION_HASH3 = "QmPP8X2rWc2uanbnKpxfzEAAuHPuThQRtxpoY8CYVJxDj9";
const METADATA_HASH1 = "QmWc8X2rWc2uanbnKpxfzEAAuHPuThQRtxpoY8CYVnuHz7";
const METADATA_HASH2 = "QmWc8X2rWc2uanbnKpxfzEAAuHPuThQRtxpoY8CYVnuHz8";
const METADATA_HASH3 = "QmWc8X2rWc2uanbnKpxfzEAAuHPuThQRtxpoY8CYVnuHz9";
const METADATA_HASH4 = "QmWc8X2rWc2uanbnKpxfzEAAuHPuThQRtxpoY8CYVnuHz0";
const VALID_VIDEO = "ZwVNLDIJKVA";
const TITLE = "A nice video";

contract('CopyrightLY NFT Evidence', function (accounts) {
  const OWNER = accounts[0];
  const MANIFESTER = accounts[1];
  const EVIDENCER = accounts[2];
  const STAKER = accounts[3];

  let clynft, clytoken, youtubeevidence, manifestations;

  before('setup contract for all tests', async () => {
    manifestations = await Manifestations.deployed();
    youtubeevidence = await YouTubeEvidence.deployed();
    clytoken = await CLYToken.deployed();
    clynft = await CopyrightLYNFT.new(manifestations.address, {from: OWNER});
    await manifestations.manifestAuthorship(MANIFESTATION_HASH1, TITLE, {from: MANIFESTER});
    await youtubeevidence.check(manifestations.address, MANIFESTATION_HASH1, VALID_VIDEO, {from: EVIDENCER});
    const CLY = new BN(10).pow(new BN(await clytoken.decimals()));
    const amount = new BN(1).mul(CLY);
    const maxPrice = web3.utils.toWei('0.01', 'ether');
    await clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH1, {value: maxPrice, from: STAKER});
  });

  it("should mint NFT for manifestations with evidence and stake if one of the authors", async () => {
    chai.expect(await manifestations.isUnevidenced(MANIFESTATION_HASH1)).to.be.false;
    chai.expect(await manifestations.isStaked(MANIFESTATION_HASH1)).to.be.true;

    const amountMinted = await clynft.amountMinted(MANIFESTER);
    const expectedTokenId = web3.utils.toBN(web3.utils.keccak256(
      web3.utils.encodePacked(MANIFESTER, amountMinted.toString())));

    const res = await clynft.mint(MANIFESTATION_HASH1, METADATA_HASH1, {from: MANIFESTER});

    expectEvent(res, 'NFTMinted', {minter: MANIFESTER, tokenId: expectedTokenId,
        tokenUri: 'ipfs://' + METADATA_HASH1, manifestations: manifestations.address,
        manifestationHash: MANIFESTATION_HASH1});

    chai.expect(await clynft.tokenURI(expectedTokenId)).to.be.equal('ipfs://' + METADATA_HASH1);
  });

  it("shouldn't allow minting if not an author", async () => {
    await expectRevert(clynft.mint(MANIFESTATION_HASH1, METADATA_HASH1, {from: STAKER}),
      "Only authors can mint NFTs for a manifestation");
  });

  it("shouldn't allow minting if manifestation without stake", async () => {
    await manifestations.manifestAuthorship(MANIFESTATION_HASH2, TITLE, {from: MANIFESTER});
    await youtubeevidence.check(manifestations.address, MANIFESTATION_HASH2, VALID_VIDEO, {from: EVIDENCER});
    await expectRevert(clynft.mint(MANIFESTATION_HASH2, METADATA_HASH3, {from: MANIFESTER}),
      "NFT cannot be minted if manifestation without stake");
  });

  it("shouldn't allow minting if manifestation without evidence", async () => {
    await manifestations.manifestAuthorship(MANIFESTATION_HASH3, TITLE, {from: MANIFESTER});
    const CLY = new BN(10).pow(new BN(await clytoken.decimals()));
    const amount = new BN(1).mul(CLY);
    const maxPrice = web3.utils.toWei('0.01', 'ether');
    await clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH3, {value: maxPrice, from: STAKER});
    await expectRevert(clynft.mint(MANIFESTATION_HASH3, METADATA_HASH4, {from: MANIFESTER}),
      "NFT cannot be minted if manifestation without evidence");
  });
});
