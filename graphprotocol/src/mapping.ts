import { Manifestations, ManifestEvent, AddedEvidence } from '../generated/Manifestations/Manifestations';
import { Manifestation } from '../generated/schema';
import { Bytes } from '@graphprotocol/graph-ts';

export function handleManifestEvent(event: ManifestEvent): void {
  let entity = new Manifestation(event.transaction.from.toHex());
  let contract = Manifestations.bind(event.address);
  let authors = new Array<Bytes>();
  entity.id = event.params.hash;
  entity.title = event.params.title;
  entity.evidenceCount = 0;
  authors.push(event.params.manifester);
  entity.authors = authors;
  entity.creationTime = event.block.timestamp;
  entity.expiryTime = entity.creationTime.plus(contract.timeToExpiry());
  entity.save();
}

export function handleAddedEvidence(event: AddedEvidence): void {
  let entity = Manifestation.load(event.transaction.from.toHex());
  if (entity) {
    entity.evidenceCount = entity.evidenceCount + 1;
    entity.save();
  }
}
