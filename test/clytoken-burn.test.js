const { expectRevert, expectEvent, BN, balance } = require('@openzeppelin/test-helpers');
const chai = require('chai');
chai.use(require('chai-bn')(BN));

const CLYToken = artifacts.require('CLYToken');
const Manifestations = artifacts.require("Manifestations");

const CLY = new BN(10).pow(new BN(16));
const RESERVE_RATIO = 500000; // 1/2 in ppm, corresponds to curve y = m * x
const INITIAL_SLOPE = 1;      // Initial curve slope m when pool balance = 0
const MAX_GASPRICE = web3.utils.toWei('100', 'gwei');
const MANIFESTATION_HASH = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
const TITLE = "A nice picture";
const UNMANIFESTED_HASH = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnpBDg";

contract('CLY Token - Burning', function (accounts) {
  const OWNER = accounts[0];
  const MANIFESTER = accounts[1];
  const STAKER1 = accounts[2];
  const STAKER2 = accounts[3];

  let clytoken, manifestations;

  before('setup contracts for all tests', async () => {
    manifestations = await Manifestations.deployed();
    await manifestations.manifestAuthorship(MANIFESTATION_HASH, TITLE, {from: MANIFESTER});
    clytoken = await CLYToken.new(RESERVE_RATIO, INITIAL_SLOPE, MAX_GASPRICE, {from: OWNER});
  });

  it("should burn previous stake on manifestation", async () => {
    const amount = new BN(1).mul(CLY);
    const maxPrice = web3.utils.toWei('10', 'ether');
    const tracker = await balance.tracker(STAKER1, 'wei');
    let currentBalance = await tracker.get();
    console.log('Initial balance', web3.utils.fromWei(currentBalance, 'ether').toString());
    let res = await clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH,
      {value: maxPrice, from: STAKER1});
    let change = await tracker.deltaWithFees('wei');
    let payed = change.delta.add(change.fees).mul(new BN(-1));
    console.log('Minted',amount.div(CLY).toString(), 'CLY for',
      web3.utils.fromWei(payed, 'ether').toString());
    expectEvent(res, 'Minted', {buyer: STAKER1, amount: amount,
      payed: payed, stakable: manifestations.address, manifestation: MANIFESTATION_HASH});

    res = await clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH,
      {value: maxPrice, from: STAKER1});
    change = await tracker.deltaWithFees('wei');
    payed = change.delta.add(change.fees).mul(new BN(-1));
    console.log('Minted',amount.div(CLY).toString(), 'CLY for',
      web3.utils.fromWei(payed, 'ether').toString());
    expectEvent(res, 'Minted', {buyer: STAKER1, amount: amount,
      payed: payed, stakable: manifestations.address, manifestation: MANIFESTATION_HASH});

    res = await clytoken.burn(amount, manifestations.address, MANIFESTATION_HASH, {from: STAKER1});

    change = await tracker.deltaWithFees('wei');
    let earned = change.delta.add(change.fees);

    expectEvent(res, 'Burned', {
      seller: STAKER1, amount: amount,
      earned: earned, manifestation: MANIFESTATION_HASH
    });

    console.log('Burned', amount.div(CLY).toString(), ' CLY for', web3.utils.fromWei(earned, 'ether').toString());

    res = await clytoken.burn(amount, manifestations.address, MANIFESTATION_HASH, {from: STAKER1});

    change = await tracker.deltaWithFees('wei');
    earned = change.delta.add(change.fees);

    expectEvent(res, 'Burned', {
      seller: STAKER1, amount: amount,
      earned: earned, manifestation: MANIFESTATION_HASH
    });

    console.log('Burned', amount.div(CLY).toString(), ' CLY for', web3.utils.fromWei(earned, 'ether').toString());

    currentBalance = await tracker.get();
    console.log('Final balance', web3.utils.fromWei(currentBalance, 'ether').toString());

    chai.expect(await clytoken.poolBalance()).to.be.bignumber.equal(new BN(0), 'Final pool balance should be 0');
  });
});
