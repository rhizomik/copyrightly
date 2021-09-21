export class Event {
  type: string | undefined;
  who: string | undefined;
  what: any;
  object: any;
  result: any;
  when: Date | undefined;
  where = '';

  constructor(values: Record<string, unknown> = {}) {
    Object.assign(this, values);
  }
}
