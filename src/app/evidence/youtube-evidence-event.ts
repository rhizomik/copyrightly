import { Event } from '../util/event';
import { YouTubeEvidence } from './youtubeEvidence';

export class YouTubeEvidenceEvent extends Event {
  what: YouTubeEvidence;

  constructor(event: any) {
    super({ type: event.event, who: event.returnValues.evidencer, where: event.transactionHash });

    this.what = new YouTubeEvidence({
      registry: event.returnValues.registry,
      evidenced: event.returnValues.evidencedHash,
      videoId: event.returnValues.videoId,
      evidencer: event.returnValues.evidencer,
      creationTime: event.when,
      isVerified: event.returnValues.isVerified
    });
  }
}
