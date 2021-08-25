import { Manifestations, ManifestEvent } from '../generated/Manifestations/Manifestations';
import { UploadEvidenceEvent } from '../generated/UploadEvidence/UploadEvidence';
import { CLYToken, Minted, Burned, CurvePurchase, CurveSale } from '../generated/CLYToken/CLYToken';
import { Manifestation, UploadEvidence, Stake, Account } from '../generated/schema';
import { Bytes, Value, BigInt, Address } from '@graphprotocol/graph-ts';


export function handleManifestEvent(event: ManifestEvent): void {
  let manifestation = new Manifestation(event.address.toHexString() + '-' + event.params.hash);
  let contract = Manifestations.bind(event.address);
  let authors = new Array<Bytes>();
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
    account.staked = BigInt.fromString('0');
  }
  let stake = Stake.load(event.params.buyer.toHexString() + '-' + event.params.stakable.toHexString() + '-' + event.params.item);
  if (!stake) {
    stake = new Stake(event.params.buyer.toHexString() + '-' + event.params.stakable.toHexString() + '-' + event.params.item);
    let item = Manifestation.load(event.params.stakable.toHexString() + '-' + event.params.item);
    if (!item) {
      return;
    }
    stake.item = item as Manifestation;
    stake.staked = BigInt.fromString('0');
    stake.stakable = event.params.stakable;
    stake.staker = account as Account;
  }
  stake.staked = stake.staked.plus(event.params.amount);
  account.staked = account.staked.plus(event.params.amount);
  stake.save();
  account.save();
}

export function handleBurnedEvent(event: Burned): void {
  let stake = Stake.load(event.params.seller.toHexString() + '-' + event.params.stakable.toHexString() + '-' + event.params.item);
  if (stake) {
    stake.staked = stake.staked.minus(event.params.amount);
    stake.save();
  }
  let account = Account.load(event.params.seller.toHexString());
  if (account) {
    account.staked = account.staked.minus(event.params.amount);
    account.save();
  }
}

export function handleCurvePurchaseEvent(event: CurvePurchase): void {}
export function handleCurveSaleEvent(event: CurveSale): void {}
