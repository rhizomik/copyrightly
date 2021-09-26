const { expectRevert, expectEvent, BN, balance } = require('@openzeppelin/test-helpers');
const chai = require('chai');
chai.use(require('chai-bn')(BN));

const CLYToken = artifacts.require('CLYToken');
const Manifestations = artifacts.require("Manifestations");

const RESERVE_RATIO = 500000; // 1/2 in ppm, corresponds to curve y = m * x
const INITIAL_SLOPE = 1;      // Initial curve slope m when pool balance = 0
const MAX_GASPRICE = web3.utils.toWei('100', 'gwei');
const MANIFESTATION_HASH = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
const TITLE = "A nice picture";
let CLY;

contract('CLY Token - Minting', function (accounts) {
  const OWNER = accounts[0];
  const MANIFESTER = accounts[1];
  const STAKER = accounts[2];

  let clytoken, manifestations;

  before('setup contracts for all tests', async () => {
    manifestations = await Manifestations.deployed();
    await manifestations.manifestAuthorship(MANIFESTATION_HASH, TITLE, {from: MANIFESTER});
    clytoken = await CLYToken.new(RESERVE_RATIO, INITIAL_SLOPE, MAX_GASPRICE, {from: OWNER});
    CLY = new BN(10).pow(new BN(await clytoken.decimals()));
    await manifestations.setToken(clytoken.address, { from: OWNER });
  });

  it("shouldn't mint tokens if paused", async () => {
    const amount = new BN(1).mul(CLY);
    const maxPrice = web3.utils.toWei('1', 'ether');

    await clytoken.pause({from: OWNER});

    await expectRevert(clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH,
      {value: maxPrice, from: STAKER}), 'Pausable: paused');
  });

  it("should mint tokens again after unpaused", async () => {
    const amount = new BN(1).mul(CLY);
    const maxPrice = web3.utils.toWei('1', 'ether');

    await clytoken.unpause({from: OWNER});

    const tracker = await balance.tracker(STAKER, 'wei');
    const currentBalance = await tracker.get();
    const res = await clytoken.mint(amount, maxPrice, manifestations.address, MANIFESTATION_HASH,
      {value: maxPrice, from: STAKER});

    const {delta, fees} = await tracker.deltaWithFees('wei');
    const payed = delta.add(fees).mul(new BN(-1));

    expectEvent(res, 'Minted', {buyer: STAKER, amount: amount,
      payed: payed, item: MANIFESTATION_HASH});

    console.log('Minted', amount.div(CLY).toString(), 'CLY for',
      web3.utils.fromWei(payed, 'ether').toString());
  });

  it("shouldn't allow non-owner to pause", async () => {
    await expectRevert(clytoken.pause({from: STAKER}), 'Ownable: caller is not the owner');
  });

  it("should allow owner to change gas price", async () => {
    await clytoken.setGasPrice(web3.utils.toWei('200', 'gwei'), {from: OWNER});
    chai.expect(await clytoken.gasPrice()).to.be.bignumber.equal(web3.utils.toWei('200', 'gwei'));
  });

  it("shouldn't allow non-owner to change gas price", async () => {
    await expectRevert(clytoken.setGasPrice(web3.utils.toWei('200', 'gwei'), {from: STAKER}),
      'Ownable: caller is not the owner');
  });

  it("shouldn't allow 0 gas price", async () => {
    await expectRevert(clytoken.setGasPrice(web3.utils.toWei('0', 'gwei'), {from: OWNER}),
      'Maximum gas price should be bigger than 0');
  });

  it("should allow owner to change reserve ratio", async () => {
    await clytoken.setReserveRatio(1000000, {from: OWNER});
    chai.expect(await clytoken.reserveRatio()).to.be.bignumber.equal(new BN(1000000));
  });

  it("shouldn't allow non-owner to change reserve ratio", async () => {
    await expectRevert(clytoken.setReserveRatio(1000000, {from: STAKER}),
      'Ownable: caller is not the owner');
  });

  it("shouldn't allow a non-PPM reserve ratio", async () => {
    await expectRevert(clytoken.setReserveRatio(1000001, {from: OWNER}),
      'Value must be in PPM');
  });

  it("shouldn't allow CLY token transfers", async () => {
    const amount = new BN(1).mul(CLY);
    await expectRevert(clytoken.transfer(STAKER, amount, {from: OWNER}),
      'CLY Token is not transferable');
  });

  it("shouldn't allow CLY token transfers from address", async () => {
    const amount = new BN(1).mul(CLY);
    await expectRevert(clytoken.transferFrom(OWNER, STAKER, amount, {from: OWNER}),
      'CLY Token is not transferable');
  });
});
