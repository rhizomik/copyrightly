import { Event } from '../util/event';
import { Manifestation } from './manifestation';

export class ManifestEvent extends Event {
  what = new Manifestation();

  constructor(event: any) {
    super({ type: event.event, who: event.returnValues?.manifester, where: event.transactionHash });
    this.what = new Manifestation({
      id: event.returnValues?.hash,
      title: event.returnValues?.title,
      creationTime: event.when,
      transaction: event.transactionHash
    });
  }
}
