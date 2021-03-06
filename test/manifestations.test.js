const {expectRevert} = require("@openzeppelin/test-helpers");
const Manifestations = artifacts.require('Manifestations');

contract('Manifestations - Single Authorship', function (accounts) {

  const OWNER = accounts[0];
  const PROXYADMIN = accounts[1];
  const MANIFESTER = accounts[2];
  const HASH = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const TITLE = "A nice picture";

  let proxy, manifestations;

  beforeEach('setup contracts for each test', async () => {
    manifestations = await Manifestations.deployed();
  });

  it("should register a previously unregistered manifestation", async () => {

    const receipt = await manifestations.manifestAuthorship(HASH, TITLE, {from: MANIFESTER});

    assert.equal(receipt.logs[0].event, 'ManifestEvent',
        'manifesting authorship should emit a ManifestEvent');
    assert.equal(receipt.logs[0].args.hash, HASH,
        'unexpected manifest event hash');
    assert.equal(receipt.logs[0].args.title, TITLE,
        'unexpected manifest event title');
    assert.equal(receipt.logs[0].args.manifester, MANIFESTER,
        'unexpected manifest event manifester');
  });

  it("should retrieve a previously registered manifestation", async () => {
    const result = await manifestations.getManifestation(HASH);

    assert.equal(result[0], TITLE,
        'unexpected manifestation title');
    assert.equal(result[1].length, 1,
        'unexpected amount of authors in manifestation');
    assert.equal(result[1][0], MANIFESTER,
        'unexpected first author in manifestation authors');
  });

  it("shouldn't register a previously registered manifestation", async () => {
    try {
      await manifestations.manifestAuthorship(HASH, TITLE, {from: MANIFESTER});
    } catch(e) {
      assert(e.reason, "Already registered and not expired or with evidence");
    }
  });

  it("should revert if empty title provided", async () => {
    await expectRevert(manifestations.manifestAuthorship(HASH, '', {from: MANIFESTER}),
      'A title is required');
  });
});

contract('Manifestations - Joint Authorship', function (accounts) {

  const OWNER = accounts[0];
  const PROXYADMIN = accounts[1];
  const MANIFESTER = accounts[2];
  const ADDITIONAL_AUTHORS = [accounts[3], accounts[4], accounts[5]];
  const HASH1 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const HASH2 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnpBDg";
  const TITLE1 = "A nice picture";
  const TITLE2 = "Another nice picture";

  let proxy, manifestations;

  beforeEach('setup contracts for each test', async () => {
    manifestations = await Manifestations.deployed();
  });

  it("should register joint authorship for unregistered manifestation", async () => {

    const receipt = await manifestations.manifestJointAuthorship(
      HASH1, TITLE1, ADDITIONAL_AUTHORS, {from: MANIFESTER});

    assert.equal(receipt.logs[0].event, 'ManifestEvent',
      'manifesting authorship should emit a ManifestEvent');
    assert.equal(receipt.logs[0].args.hash, HASH1,
      'unexpected manifest event hash');
    assert.equal(receipt.logs[0].args.title, TITLE1,
      'unexpected manifest event title');
    assert.equal(receipt.logs[0].args.manifester, MANIFESTER,
      'unexpected manifest event manifester');
  });

  it("should retrieve a previously registered joint authorship manifestation", async () => {
    const result = await manifestations.getManifestation(HASH1);

    assert.equal(result[0], TITLE1,
      'unexpected manifestation title');
    assert.equal(result[1].length, 4,
      'unexpected amount of authors in manifestation');
    assert.equal(result[1][0], MANIFESTER,
      'unexpected first author in manifestation authors');
    assert.equal(result[1][1], accounts[3],
      'unexpected second author in manifest event authors');
    assert.equal(result[1][2], accounts[4],
      'unexpected third author in manifest event authors');
    assert.equal(result[1][3], accounts[5],
      'unexpected fourth author in manifest event authors');
  });

  it("shouldn't register a previously registered joint authorship manifestation", async () => {
    try {
      await manifestations.manifestJointAuthorship(
        HASH1, TITLE1, ADDITIONAL_AUTHORS, {from: MANIFESTER});
    } catch(e) {
      assert(e.reason, "Already registered and not expired or with evidence");
    }
  });

  it("should revert if more than 64 authors are defined", async () => {
    const TOO_MANY_AUTHORS = new Array(64).fill(accounts[0]);
    await expectRevert(manifestations.manifestJointAuthorship(HASH2, TITLE2, TOO_MANY_AUTHORS, {from: MANIFESTER}),
      'Joint authorship limited to 64 authors');
  });
});
