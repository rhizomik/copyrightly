const { expectRevert, expectEvent, BN, balance } = require('@openzeppelin/test-helpers');
const chai = require('chai');
chai.use(require('chai-bn')(BN));

const CLYToken = artifacts.require('CLYToken');
const Manifestations = artifacts.require("Manifestations");

const RESERVE_RATIO = 500000; // 1/2 in ppm, corresponds to curve y = m * x
const INITIAL_SLOPE = 1;      // Initial curve slope m when pool balance = 0
const MAX_GASPRICE = web3.utils.toWei('100', 'gwei');
const MANIFESTATION_HASH1 = "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv";
const TITLE1 = "A nice picture";
const MANIFESTATION_HASH2 = "QmQA1NCwGCGJTKcLDt4t4rXfdgaR5NwSEUvZ1KoairnVPU";
const TITLE2 = "Another nice picture";
const UNMANIFESTED_HASH = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnpBDg";
let CLY;

contract('CLY Token - Minting', function (accounts) {
  const OWNER = accounts[0];
  const MANIFESTER = accounts[1];
  const STAKER1 = accounts[2];
  const STAKER2 = accounts[3];

  let clytoken, manifestations;

  before('setup contracts for all tests', async () => {
    manifestations = await Manifestations.deployed();
    await manifestations.manifestAuthorship(MANIFESTATION_HASH1, TITLE1, {from: MANIFESTER});
    await manifestations.manifestAuthorship(MANIFESTATION_HASH2, TITLE2, {from: MANIFESTER});
    clytoken = await CLYToken.new(RESERVE_RATIO, INITIAL_SLOPE, MAX_GASPRICE, {from: OWNER});
    CLY = new BN(10).pow(new BN(await clytoken.decimals()));
    await manifestations.setToken(clytoken.address, { from: OWNER });
  });

  it("should mint when there is not pool balance yet using default slope", async () => {
    const amount = new BN(1).mul(CLY);
    const maxPrice = web3.utils.toWei('0.01', 'ether');

    chai.expect(await clytoken.poolBalance()).to.be.bignumber.equal(new BN(0));

    const res = await clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH1,
      {value: maxPrice, from: STAKER1});

    expectEvent(res, 'Minted', {buyer: STAKER1, amount: amount,
      payed: amount.mul(new BN(INITIAL_SLOPE)), manifestation: MANIFESTATION_HASH1 });

    console.log('Minted', amount.div(CLY).toString(), 'CLY for',
      web3.utils.fromWei(amount, 'ether').toString());
  });

  it("should mint using bonding curve when there is pool balance", async () => {
    const amount = new BN(1).mul(CLY);
    const maxPrice = web3.utils.toWei('1', 'ether');

    chai.expect(await clytoken.poolBalance()).to.be.bignumber.equal(new BN(web3.utils.toWei('0.01', 'ether')));

    const tracker = await balance.tracker(STAKER1, 'wei');
    const currentBalance = await tracker.get();

    const res = await clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH1,
      {value: maxPrice, from: STAKER1});

    const {delta, fees} = await tracker.deltaWithFees('wei');
    const payed = delta.add(fees).mul(new BN(-1));

    expectEvent(res, 'Minted', {buyer: STAKER1, amount: amount,
      payed: payed, manifestation: MANIFESTATION_HASH1});

    console.log('Minted', amount.div(CLY).toString(), 'CLY for',
      web3.utils.fromWei(payed, 'ether').toString());
  });

  it("should accumulate stake for the same manifestation and total supply", async () => {
    const amount = new BN(1).mul(CLY);
    const accumulatedSupply = new BN(3).mul(CLY);
    const maxPrice = web3.utils.toWei('1', 'ether');
    const tracker = await balance.tracker(STAKER2, 'wei');
    const currentBalance = await tracker.get();

    const res = await clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH1,
      {value: maxPrice, from: STAKER2});

    const {delta, fees} = await tracker.deltaWithFees('wei');
    const payed = delta.add(fees).mul(new BN(-1));

    expectEvent(res, 'Minted', {buyer: STAKER2, amount: amount,
      payed: payed, manifestation: MANIFESTATION_HASH1});

    console.log('Minted', amount.div(CLY).toString(), 'CLY for',
      web3.utils.fromWei(payed, 'ether').toString());

    chai.expect(await manifestations.staked(MANIFESTATION_HASH1)).to.be.bignumber.equal(accumulatedSupply);
    chai.expect(await clytoken.getIndividualStake(MANIFESTATION_HASH1, STAKER2)).to.be.bignumber.equal(amount);
    chai.expect(await clytoken.totalSupply()).to.be.bignumber.equal(accumulatedSupply);
  });

  it("shouldn't accumulate stake for different manifestations", async () => {
    const amount = new BN(1).mul(CLY);
    const accumulatedSupply = new BN(4).mul(CLY);
    const maxPrice = web3.utils.toWei('1', 'ether');
    const tracker = await balance.tracker(STAKER2, 'wei');
    const currentBalance = await tracker.get();

    const res = await clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH2,
      {value: maxPrice, from: STAKER2});

    const {delta, fees} = await tracker.deltaWithFees('wei');
    const payed = delta.add(fees).mul(new BN(-1));

    expectEvent(res, 'Minted', {buyer: STAKER2, amount: amount,
      payed: payed, manifestation: MANIFESTATION_HASH2});

    console.log('Minted', amount.div(CLY).toString(), 'CLY for',
      web3.utils.fromWei(payed, 'ether').toString());

    chai.expect(await manifestations.staked(MANIFESTATION_HASH1)).to.be.bignumber.equal(new BN(3).mul(CLY));
    chai.expect(await manifestations.staked(MANIFESTATION_HASH2)).to.be.bignumber.equal(amount);
    chai.expect(await clytoken.getIndividualStake(MANIFESTATION_HASH2, STAKER2)).to.be.bignumber.equal(amount);
    chai.expect(await clytoken.getIndividualStake(MANIFESTATION_HASH2, STAKER1)).to.be.bignumber.equal(new BN(0));
    chai.expect(await clytoken.totalSupply()).to.be.bignumber.equal(accumulatedSupply);
  });

  it("should revert if sent value is not enough", async () => {
    const amount = new BN(1).mul(CLY);
    const maxPrice = web3.utils.toWei('0.0001', 'ether');

    await expectRevert(clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH1,
      {value: maxPrice, from: STAKER1}), 'Current price exceeds maximum provided');
  });

  it("should revert if sent value doesn't match specified max price", async () => {
    const amount = new BN(1).mul(CLY);
    const maxPrice = web3.utils.toWei('1', 'ether');
    const sentValue = web3.utils.toWei('0.1', 'ether');

    await expectRevert(clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH1,
      {value: sentValue, from: STAKER1}), 'Incorrect Ether value sent');
  });

  it("should revert if amount to mint is 0", async () => {
    const maxPrice = web3.utils.toWei('1', 'ether');

    await expectRevert(clytoken.mint(new BN(0), maxPrice, manifestations.address, MANIFESTATION_HASH1,
      {value: maxPrice, from: STAKER1}), 'Must specify a non-zero amount of CLY');
  });

  it("shouldn't mint tokens if non-existing manifestation", async () => {
    const amount = new BN(1).mul(CLY);
    const maxPrice = web3.utils.toWei('1', 'ether');

    await expectRevert(clytoken.mint(amount, maxPrice, manifestations.address, UNMANIFESTED_HASH,
        {value: maxPrice, from: STAKER1}), 'The manifestation should exist to accept stake');
  });

  it("should increase the amount payed for successive mints", async () => {
    const amount = new BN(1).mul(CLY);
    const maxPrice = web3.utils.toWei('1', 'ether');
    const tracker = await balance.tracker(STAKER1, 'wei');
    const currentBalance = await tracker.get();

    let previousPrice = new BN(0);
    for (let i=0; i < 10; i++) {
      const res = await clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH1,
        {value: maxPrice, from: STAKER1});

      const {delta, fees} = await tracker.deltaWithFees('wei');
      const payed = delta.add(fees).mul(new BN(-1));

      expectEvent(res, 'Minted', {buyer: STAKER1, amount: amount,
        payed: payed, stakable: manifestations.address, manifestation: MANIFESTATION_HASH1});

      chai.expect(payed).to.be.bignumber.greaterThan(previousPrice);

      console.log('Minted',amount.div(CLY).toString(), 'CLY for',
        web3.utils.fromWei(payed, 'ether').toString(), "Increase:",
        web3.utils.fromWei(payed.sub(previousPrice), 'ether').toString())

      previousPrice = payed;
    }
  });
});
