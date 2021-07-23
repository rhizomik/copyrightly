import { Event } from '../util/event';
import { UploadEvidence } from './uploadEvidence';

export class UploadEvidenceEvent extends Event {
  what: UploadEvidence;

  constructor(event: any) {
    super({ type: event.event, who: event.returnValues.evidencer, where: event.transactionHash });

    this.what = new UploadEvidence({
      id: event.returnValues.evidenceHash,
      registry: event.returnValues.registry,
      evidenced: event.returnValues.evidencedHash,
      evidencer: event.returnValues.evidencer,
      creationTime: event.when,
      transaction: event.transactionHash
    });
  }
}
