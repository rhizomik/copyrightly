const { expectRevert, expectEvent, BN, balance } = require('@openzeppelin/test-helpers');
const chai = require('chai');
chai.use(require('chai-bn')(BN));

const Manifestations = artifacts.require('./Manifestations.sol');
const CLYToken = artifacts.require('CLYToken');

contract('Manifestations - Expirable', function (accounts) {

  const OWNER = accounts[0];
  const MANIFESTER1 = accounts[1];
  const MANIFESTER2 = accounts[2];
  const STAKER1 = accounts[3];
  const HASH1 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const HASH2 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnpBDg";
  const EVIDENCE_HASH = "QmPP8X2rWc2uanbnKpxfzEAAuHPuThQRtxpoY8CYVJxDj8";
  const TITLE_OLD = "A nice picture";
  const TITLE_NEW = "My nice picture";
  const timeToExpiry = 2; // Expiry 2 seconds
  const RESERVE_RATIO = 500000; // 1/2 in ppm, corresponds to curve y = m * x
  const INITIAL_SLOPE = 1;      // Initial curve slope m when pool balance = 0
  const MAX_GASPRICE = web3.utils.toWei('100', 'gwei');

  let manifestations, clytoken, CLY;

  beforeEach('setup specific contracts for this test with short expiry', async () => {
    manifestations = await Manifestations.new(timeToExpiry, {from: OWNER});
    clytoken = await CLYToken.new(RESERVE_RATIO, INITIAL_SLOPE, MAX_GASPRICE, {from: OWNER});
    CLY = new BN(10).pow(new BN(await clytoken.decimals()));
  });

  it("should re-register just when already expired", async () => {
    await manifestations.manifestAuthorship(HASH1, TITLE_OLD, {from: MANIFESTER1});

    let res = await manifestations.getManifestation(HASH1);
    chai.expect(res[0]).to.be.equal(TITLE_OLD, 'Title shouldn\'t change if not expired');
    chai.expect(res[1][0]).to.be.equal(MANIFESTER1, 'Manifester shouldn\'t change if not expired');

    await expectRevert(manifestations.manifestAuthorship(HASH1, TITLE_NEW, {from: MANIFESTER2}),
      'Already registered and not expired or with stake');

    res = await manifestations.getManifestation(HASH1);
    const oldTimestamp = new BN(res[2]);
    chai.expect(res[0]).to.be.equal(TITLE_OLD, 'Title shouldn\'t change if not expired');
    chai.expect(res[1][0]).to.be.equal(MANIFESTER1, 'Manifester shouldn\'t change if not expired');

    await sleep(3*1000);

    await manifestations.manifestAuthorship(HASH1, TITLE_NEW, {from: MANIFESTER2});

    res = await manifestations.getManifestation(HASH1);

    chai.expect(res[0]).to.be.equal(TITLE_NEW, 'Title should be writable after expiration');
    chai.expect(res[1][0]).to.be.equal(MANIFESTER2, 'Manifester should change if overwritten');
    chai.expect(res[2]).to.be.bignumber.greaterThan(oldTimestamp.add(new BN(timeToExpiry)),
      'Overwrite time should be after previous registration expiration time');
  });

  it("shouldn't expire if manifestation with stake", async () => {
    const amount = new BN(1).mul(CLY);
    const maxPrice = web3.utils.toWei('0.01', 'ether');

    await manifestations.setToken(clytoken.address, { from: OWNER });
    await manifestations.manifestAuthorship(HASH2, TITLE_OLD, {from: MANIFESTER1});

    let res = await clytoken.mint(amount, maxPrice, manifestations.address, HASH2,
      {value: maxPrice, from: STAKER1});

    expectEvent(res, 'Minted', {buyer: STAKER1, amount: amount, manifestation: HASH2 });

    await sleep(3*1000);

    await expectRevert(manifestations.manifestAuthorship(HASH2, TITLE_NEW, {from: MANIFESTER2}),
      'Already registered and not expired or with stake');

    res = await manifestations.getManifestation(HASH2);

    chai.expect(res[0]).to.be.equal(TITLE_OLD, 'Title shouldn\'t change if not expired');
    chai.expect(res[1][0]).to.be.equal(MANIFESTER1, 'Manifester shouldn\'t change if not expired');
  });
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
