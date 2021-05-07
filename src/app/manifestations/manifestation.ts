export class Manifestation {
  hash = '';
  title = '';
  authors: string[] = [];
  when = new Date();
  expiry = new Date();

  constructor(values: Record<string, unknown> = {}) {
    if (values.hasOwnProperty('when')) {
      values.when = new Date(values.when as number * 1000);
    }
    if (values.hasOwnProperty('expiry')) {
      values.expiry = new Date(values.expiry as number * 1000);
    }
    Object.assign(this, values);
  }
}
