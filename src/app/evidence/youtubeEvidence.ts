export class YouTubeEvidence {
  id: string | undefined;
  registry: string | undefined;
  evidenced: string | undefined;
  videoId: string | undefined;
  evidencer: string | undefined;
  creationTime = new Date();
  transaction: string | undefined;
  isVerified = false;

  constructor(values: Record<string, unknown> = {}) {
    if (values.hasOwnProperty('creationTime')) {
      values.creationTime = new Date(values.creationTime as number * 1000);
    }
    Object.assign(this, values);
  }
}
