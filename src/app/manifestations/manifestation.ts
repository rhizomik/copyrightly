import { CLYToken } from '../clytoken/clytoken';
import { BigNumber } from 'bignumber.js';

export class Manifestation {
  id = '';
  contract = '';
  hash = '';
  title = '';
  authors: string[] = [];
  creationTime = new Date();
  expiryTime = new Date();
  evidenceCount = 0;
  transaction = '';
  staked = new BigNumber(0);

  constructor(values: Record<string, unknown> = {}) {
    if (values.hasOwnProperty('creationTime')) {
      values.creationTime = new Date(values.creationTime as number * 1000);
    }
    if (values.hasOwnProperty('expiryTime')) {
      values.expiryTime = new Date(values.expiryTime as number * 1000);
    }
    if (values.hasOwnProperty('staked')) {
      values.staked = new BigNumber(values.staked as string);
    }
    Object.assign(this, values);
  }

  getStaked(): string {
    return CLYToken.toNumber(this.staked.toString());
  }
}
