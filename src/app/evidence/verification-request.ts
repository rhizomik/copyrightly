import { Event } from '../util/event';

export class VerificationRequest extends Event {
  watching: boolean;

  constructor(event: any) {
    super({ type: event.event });
    this.what = event.returnValues.requestId;
    this.result = event.returnValues.evidencedHash;
    this.object = event.returnValues.videoId;
    this.watching = event.watching;
  }
}
