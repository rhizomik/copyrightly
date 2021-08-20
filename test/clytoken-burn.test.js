const { expectRevert, expectEvent, BN, balance } = require('@openzeppelin/test-helpers');
const chai = require('chai');
chai.use(require('chai-bn')(BN));

const CLYToken = artifacts.require('CLYToken');
const Manifestations = artifacts.require("Manifestations");

const CLY = new BN(10).pow(new BN(16));
const RESERVE_RATIO = 500000; // 1/2 in ppm, corresponds to curve y = m * x
const INITIAL_SLOPE = 1;      // Initial curve slope m when pool balance = 0
const MAX_GASPRICE = web3.utils.toWei('100', 'gwei');
const MANIFESTATION_HASH1 = "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv";
const TITLE1 = "A nice picture";
const MANIFESTATION_HASH2 = "QmQA1NCwGCGJTKcLDt4t4rXfdgaR5NwSEUvZ1KoairnVPU";
const TITLE2 = "Another nice picture";
const UNMANIFESTED_HASH = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnpBDg";

contract('CLY Token - Burning', function (accounts) {
  const OWNER = accounts[0];
  const MANIFESTER = accounts[1];
  const STAKER1 = accounts[2];
  const STAKER2 = accounts[3];
  const amount = new BN(1).mul(CLY);
  const maxPrice = web3.utils.toWei('1', 'ether');

  let clytoken, manifestations;

  before('setup contracts for all tests', async () => {
    manifestations = await Manifestations.deployed();
    await manifestations.manifestAuthorship(MANIFESTATION_HASH1, TITLE1, {from: MANIFESTER});
    await manifestations.manifestAuthorship(MANIFESTATION_HASH2, TITLE2, {from: MANIFESTER});
    clytoken = await CLYToken.new(RESERVE_RATIO, INITIAL_SLOPE, MAX_GASPRICE, {from: OWNER});
    await clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH1,
      {value: maxPrice, from: STAKER1});
    await clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH1,
      {value: maxPrice, from: STAKER2});
    await clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH1,
      {value: maxPrice, from: STAKER1});
    await clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH2,
      {value: maxPrice, from: STAKER1});
  });

  it("should burn own stake on manifestation", async () => {
    const tracker = await balance.tracker(STAKER1, 'wei');
    let currentBalance = await tracker.get();

    let res = await clytoken.burn(amount, manifestations.address, MANIFESTATION_HASH1, {from: STAKER1});

    let change = await tracker.deltaWithFees('wei');
    let earned = change.delta.add(change.fees);

    expectEvent(res, 'Burned', {
      seller: STAKER1, amount: amount,
      earned: earned, manifestation: MANIFESTATION_HASH1
    });

    console.log('Burned', amount.div(CLY).toString(), ' CLY for', web3.utils.fromWei(earned, 'ether').toString());
  });

  it("shouldn't burn more than staked by the user", async () => {
    const tracker = await balance.tracker(STAKER1, 'wei');
    let currentBalance = await tracker.get();

    let res = await clytoken.burn(amount, manifestations.address, MANIFESTATION_HASH1, {from: STAKER1});

    let change = await tracker.deltaWithFees('wei');
    let earned = change.delta.add(change.fees);

    expectEvent(res, 'Burned', {
      seller: STAKER1, amount: amount,
      earned: earned, manifestation: MANIFESTATION_HASH1
    });

    console.log('Burned', amount.div(CLY).toString(), ' CLY for', web3.utils.fromWei(earned, 'ether').toString());

    await expectRevert(clytoken.burn(amount, manifestations.address, MANIFESTATION_HASH1, {from: STAKER1}),
      'Holder hasn\'t enough CLY to unstake');
  });

  it("should revert if amount to burn is 0", async () => {
    const maxPrice = web3.utils.toWei('1', 'ether');

    await expectRevert(clytoken.burn(new BN(0), manifestations.address, MANIFESTATION_HASH1, {from: STAKER1}),
      'Must specify a non-zero amount of CLY');
  });

  it("shouldn't burn stake if non-existing manifestation", async () => {
    await expectRevert(clytoken.burn(amount, manifestations.address, UNMANIFESTED_HASH, {from: STAKER1}),
      'The manifestation should exist to accept stake');
  });

  it("shouldn't burn if stake is not own", async () => {
    await expectRevert(clytoken.burn(amount, manifestations.address, MANIFESTATION_HASH1, {from: STAKER1}),
      'Holder hasn\'t enough CLY to unstake');

    const tracker = await balance.tracker(STAKER2, 'wei');
    let currentBalance = await tracker.get();

    let res = await clytoken.burn(amount, manifestations.address, MANIFESTATION_HASH1, {from: STAKER2});

    let change = await tracker.deltaWithFees('wei');
    let earned = change.delta.add(change.fees);

    expectEvent(res, 'Burned', {
      seller: STAKER2, amount: amount,
      earned: earned, manifestation: MANIFESTATION_HASH1
    });

    console.log('Burned', amount.div(CLY).toString(), ' CLY for', web3.utils.fromWei(earned, 'ether').toString());
  });

  it("shouldn't burn tokens if paused", async () => {
    const amount = new BN(1).mul(CLY);
    const maxPrice = web3.utils.toWei('1', 'ether');

    await clytoken.pause({from: OWNER});

    await expectRevert(clytoken.burn(amount, manifestations.address, MANIFESTATION_HASH2, {from: STAKER1}),
      'Pausable: paused');
  });

  it("should burn tokens again after unpause", async () => {
    await clytoken.unpause({from: OWNER});

    const tracker = await balance.tracker(STAKER1, 'wei');
    let currentBalance = await tracker.get();

    let res = await clytoken.burn(amount, manifestations.address, MANIFESTATION_HASH2, {from: STAKER1});

    let change = await tracker.deltaWithFees('wei');
    let earned = change.delta.add(change.fees);

    expectEvent(res, 'Burned', {
      seller: STAKER1, amount: amount,
      earned: earned, manifestation: MANIFESTATION_HASH2
    });

    console.log('Burned', amount.div(CLY).toString(), ' CLY for', web3.utils.fromWei(earned, 'ether').toString());
  });

  it("should put back pool balance to 0 if all stake has been burned", async () => {
    chai.expect(await clytoken.poolBalance()).to.be.bignumber.equal(new BN(0), 'Final pool balance should be 0');
  });

});
