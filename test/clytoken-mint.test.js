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

contract('CLY Token - Minting', function (accounts) {
  const OWNER = accounts[0];
  const MANIFESTER = accounts[1];
  const STAKER = accounts[2];

  let clytoken, manifestations;

  before('setup contracts for all tests', async () => {
    manifestations = await Manifestations.deployed();
    await manifestations.manifestAuthorship(MANIFESTATION_HASH, TITLE, {from: MANIFESTER});
    clytoken = await CLYToken.new(RESERVE_RATIO, INITIAL_SLOPE, MAX_GASPRICE, {from: OWNER});
  });

  it("should mint when supply is 0 using default slope", async () => {
    const amount = new BN(1).mul(CLY);
    const maxPrice = web3.utils.toWei('10', 'ether');
    const tracker = await balance.tracker(STAKER, 'wei');

    const res = await clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH,
      {value: maxPrice, from: STAKER});

    expectEvent(res, 'Minted', {buyer: STAKER, amount: amount,
      payed: amount, manifestation: MANIFESTATION_HASH });

    console.log('Minted', amount.div(CLY).toString(), 'CLY for',
      web3.utils.fromWei(amount, 'ether').toString());
  });

  it("should mint tokens for ETH for existing manifestation", async () => {
    const amount = new BN(1).mul(CLY);
    const maxPrice = web3.utils.toWei('10', 'ether');
    const tracker = await balance.tracker(STAKER, 'wei');
    const currentBalance = await tracker.get();

    const res = await clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH,
      {value: maxPrice, from: STAKER});

    const {delta, fees} = await tracker.deltaWithFees('wei');
    const payed = delta.add(fees).mul(new BN(-1));

    expectEvent(res, 'Minted', {buyer: STAKER, amount: amount,
      payed: payed, manifestation: MANIFESTATION_HASH});

    console.log('Minted', amount.div(CLY).toString(), 'CLY for',
      web3.utils.fromWei(payed, 'ether').toString());
  });

  it("shouldn't mint tokens if non-existing manifestation", async () => {
    const amount = new BN(1).mul(CLY);
    const maxPrice = web3.utils.toWei('10', 'ether');

    await expectRevert(clytoken.mint(amount, maxPrice, manifestations.address, UNMANIFESTED_HASH,
        {value: maxPrice, from: STAKER}), 'The manifestation should exist to accept stake');
  });

  it("should increase the amount payed for successive mints", async () => {
    const amount = new BN(1).mul(CLY);
    const maxPrice = web3.utils.toWei('10', 'ether');
    const tracker = await balance.tracker(STAKER, 'wei');
    const currentBalance = await tracker.get();

    let previousPrice = new BN(0);
    for (let i=0; i < 10; i++) {
      const res = await clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH,
        {value: maxPrice, from: STAKER});

      const {delta, fees} = await tracker.deltaWithFees('wei');
      const payed = delta.add(fees).mul(new BN(-1));

      expectEvent(res, 'Minted', {buyer: STAKER, amount: amount,
        payed: payed, stakable: manifestations.address, manifestation: MANIFESTATION_HASH});

      chai.expect(payed).to.be.bignumber.greaterThan(previousPrice);

      console.log('Minted',amount.div(CLY).toString(), 'CLY for',
        web3.utils.fromWei(payed, 'ether').toString(), "Increase:",
        web3.utils.fromWei(payed.sub(previousPrice), 'ether').toString())

      previousPrice = payed;
    }
  });
});
