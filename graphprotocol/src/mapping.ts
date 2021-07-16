import { Manifestations, ManifestEvent, AddedEvidence } from '../generated/Manifestations/Manifestations';
import { UploadEvidenceEvent } from '../generated/UploadEvidence/UploadEvidence';
import { Manifestation, UploadEvidence } from '../generated/schema';
import { Bytes, Value } from '@graphprotocol/graph-ts';

export function handleManifestEvent(event: ManifestEvent): void {
  let manifestation = new Manifestation(event.params.hash);
  let contract = Manifestations.bind(event.address);
  let authors = new Array<Bytes>();
  manifestation.id = event.params.hash;
  manifestation.title = event.params.title;
  manifestation.evidenceCount = 0;
  authors.push(event.params.manifester);
  manifestation.authors = authors;
  manifestation.creationTime = event.block.timestamp;
  manifestation.expiryTime = manifestation.creationTime.plus(contract.timeToExpiry());
  manifestation.set('transaction', Value.fromBytes(event.transaction.hash));
  manifestation.save();
}

export function handleAddedEvidence(event: AddedEvidence): void {}

export function handleUploadEvidenceEvent(event: UploadEvidenceEvent): void {
  let uploadEvidence = new UploadEvidence(event.params.evidenceHash);
  uploadEvidence.id = event.params.evidenceHash;
  uploadEvidence.registry = event.params.registry;
  uploadEvidence.evidenced = event.params.evidencedHash;
  uploadEvidence.evidencer = event.params.evidencer;
  uploadEvidence.set('transaction', Value.fromBytes(event.transaction.hash));
  uploadEvidence.save();
  let manifestation = Manifestation.load(event.params.evidencedHash);
  if (manifestation) {
    manifestation.evidenceCount = manifestation.evidenceCount + 1;
    manifestation.save();
  }
}
