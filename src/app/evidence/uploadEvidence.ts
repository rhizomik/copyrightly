export class UploadEvidence {
  evidencedHash: string | undefined;
  evidenceHash: string | undefined;

  constructor(values: Record<string, unknown> = {}) {
    Object.assign(this, values);
  }
}
