export class Manifestation {
  id = '';
  title = '';
  authors: string[] = [];
  creationTime = new Date();
  expiryTime = new Date();
  evidenceCount = 0;
  transaction = '';

  constructor(values: Record<string, unknown> = {}) {
    if (values.hasOwnProperty('creationTime')) {
      values.creationTime = new Date(values.creationTime as number * 1000);
    }
    if (values.hasOwnProperty('expiryTime')) {
      values.expiryTime = new Date(values.expiryTime as number * 1000);
    }
    Object.assign(this, values);
  }
}
