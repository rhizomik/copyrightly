import { Manifestations, ManifestEvent } from '../generated/Manifestations/Manifestations';
import { UploadEvidenceEvent } from '../generated/UploadEvidence/UploadEvidence';
import { CLYToken, Minted, Burned, CurvePurchase, CurveSale } from '../generated/CLYToken/CLYToken';
import { Manifestation, UploadEvidence, Stake, Account, ERC20Token, PricePoint } from '../generated/schema';
import { Bytes, Value, BigInt, Address } from '@graphprotocol/graph-ts';


export function handleManifestEvent(event: ManifestEvent): void {
  let manifestation = new Manifestation(event.address.toHexString() + '-' + event.params.hash);
  let contract = Manifestations.bind(event.address);
  let authors = new Array<Bytes>();
  manifestation.hash = event.params.hash;
  manifestation.stakable = event.address;
  manifestation.title = event.params.title;
  manifestation.evidenceCount = 0;
  authors.push(event.params.manifester);
  manifestation.authors = authors;
  manifestation.creationTime = event.block.timestamp;
  manifestation.expiryTime = manifestation.creationTime.plus(contract.timeToExpiry());
  manifestation.staked = BigInt.fromString('0');
  manifestation.set('transaction', Value.fromBytes(event.transaction.hash));
  manifestation.save();
}

export function handleUploadEvidenceEvent(event: UploadEvidenceEvent): void {
  let uploadEvidence = new UploadEvidence(event.params.evidenceHash);
  uploadEvidence.registry = event.params.registry;
  uploadEvidence.evidenced = event.params.evidencedHash;
  uploadEvidence.evidencer = event.params.evidencer;
  uploadEvidence.set('creationTime', Value.fromBigInt(event.block.timestamp));
  uploadEvidence.set('transaction', Value.fromBytes(event.transaction.hash));
  uploadEvidence.save();
  let manifestation = Manifestation.load(event.params.registry.toHexString() + '-' + event.params.evidencedHash);
  if (manifestation) {
    manifestation.evidenceCount = manifestation.evidenceCount + 1;
    manifestation.save();
  }
}

export function handleMintedEvent(event: Minted): void {
  let account = Account.load(event.params.buyer.toHexString());
  if (!account) {
    account = new Account(event.params.buyer.toHexString());
    account.token = getERC20Token(event.address);
    account.staked = BigInt.fromString('0');
  }
  let stake = Stake.load(event.params.buyer.toHexString() + '-' + event.params.stakable.toHexString() + '-' + event.params.item);
  let item = Manifestation.load(event.params.stakable.toHexString() + '-' + event.params.item);
  if (!stake) {
    stake = new Stake(event.params.buyer.toHexString() + '-' + event.params.stakable.toHexString() + '-' + event.params.item);
    if (!item) {
      return;
    }
    stake.item = item as Manifestation;
    stake.staked = BigInt.fromString('0');
    stake.stakable = event.params.stakable;
    stake.staker = account as Account;
    stake.token = getERC20Token(event.address);
  }
  item.staked = item.staked.plus(event.params.amount);
  stake.staked = stake.staked.plus(event.params.amount);
  account.staked = account.staked.plus(event.params.amount);
  item.save();
  stake.save();
  account.save();
}

export function handleBurnedEvent(event: Burned): void {
  let stakeId = event.params.seller.toHexString() + '-' + event.params.stakable.toHexString() + '-' + event.params.item;
  let stake = Stake.load(stakeId);
  if (stake) {
    stake.staked = stake.staked.minus(event.params.amount);
    if (stake.staked.isZero()) {
      Stake.remove(stakeId);
    } else {
      stake.save();
    }
  }
  let account = Account.load(event.params.seller.toHexString());
  if (account) {
    account.staked = account.staked.minus(event.params.amount);
    if (account.staked.isZero()) {
      Account.remove(event.params.seller.toHexString());
    } else {
      account.save();
    }
  }
  let item = Manifestation.load(event.params.stakable.toHexString() + '-' + event.params.item);
  if (item) {
    item.staked = item.staked.minus(event.params.amount);
    item.save();
  }
}

export function handleCurvePurchaseEvent(event: CurvePurchase): void {
  let erc20 = getERC20Token(event.address);
  let pricePoint = new PricePoint(event.block.hash.toHexString() + '-' +
    event.transaction.hash.toHexString() + '-' + event.logIndex.toHexString());
  pricePoint.token = erc20;
  pricePoint.supply = event.params.supply;
  pricePoint.balance = event.params.balance;
  pricePoint.amount = event.params.amount;
  pricePoint.price = event.params.price;
  pricePoint.type = 'Purchase';
  pricePoint.timestamp = event.block.timestamp;
  pricePoint.save();
  let clytoken = CLYToken.bind(event.address);
  erc20.supply = clytoken.totalSupply();
  erc20.balance = clytoken.poolBalance();
  erc20.price = event.params.price;
  erc20.save();
}

export function handleCurveSaleEvent(event: CurveSale): void {
  let erc20 = getERC20Token(event.address);
  let pricePoint = new PricePoint(event.block.hash.toHexString() + '-' +
    event.transaction.hash.toHexString() + '-' + event.logIndex.toHexString());
  pricePoint.token = erc20;
  pricePoint.supply = event.params.supply;
  pricePoint.balance = event.params.balance;
  pricePoint.amount = event.params.amount;
  pricePoint.price = event.params.price;
  pricePoint.type = 'Sale';
  pricePoint.timestamp = event.block.timestamp;
  pricePoint.save();
  let clytoken = CLYToken.bind(event.address);
  erc20.supply = clytoken.totalSupply();
  erc20.balance = clytoken.poolBalance();
  erc20.price = event.params.price;
  erc20.save();
}

function getERC20Token(address: Address): ERC20Token {
  let erc20 = ERC20Token.load(address.toHexString());
  if (!erc20) {
    erc20 = new ERC20Token(address.toHexString());
    erc20.name = 'CopyrightLY Token';
    erc20.symbol = 'CLY';
    let clytoken = CLYToken.bind(address);
    erc20.decimals = clytoken.decimals();
    erc20.supply = clytoken.totalSupply();
    erc20.balance = clytoken.poolBalance();
  }
  return erc20 as ERC20Token;
}
