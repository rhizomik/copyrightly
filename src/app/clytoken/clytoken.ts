import { BigNumber } from 'bignumber.js';

export enum TransactionType {
  purchase,
  sell
}

export class CLYToken {
  static decimals = 16;
  static description = 'CopyrightLY Token';
  static symbol = 'CLY';
  static clyDecimals = new BigNumber(10).pow(CLYToken.decimals);
  static etherDecimals = new BigNumber(10).pow(18);
  amount = 0;
  balance = 0;
  supply = 0;
  price = 0;

  constructor(values: Record<string, unknown> = {}) {
    Object.assign(this, values);
  }

  static toNumber(amount: string): string {
    return new BigNumber(amount).div(this.clyDecimals).toString();
  }

  static toEther(amount: string): string {
    return new BigNumber(amount).div(this.etherDecimals).toString();
  }

  static toBigNumber(amount: number): string {
    return new BigNumber(amount).multipliedBy(this.clyDecimals).toString();
  }

  static toWei(amount: string): string {
    return new BigNumber(amount).multipliedBy(this.etherDecimals).toString();
  }
}
