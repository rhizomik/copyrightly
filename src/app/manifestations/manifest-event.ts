import { Event } from '../util/event';
import { Manifestation } from './manifestation';

export class ManifestEvent extends Event {
  what = new Manifestation();

  constructor(event: any) {
    super({ type: event.event, who: event.returnValues.manifester });
    this.what = new Manifestation({
      authors: [event.returnValues.manifester],
      hash: event.returnValues.hash,
      title: event.returnValues.title
    });
  }
}
