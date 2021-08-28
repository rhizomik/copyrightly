import { BigNumber } from 'bignumber.js';

export class CLYToken {
  static decimals = 16;
  static description = 'CopyrightLY Token';
  static symbol = 'CLY';
  amount = 0;
  balance = 0;
  supply = 0;
  price = 0;

  constructor(values: Record<string, unknown> = {}) {
    Object.assign(this, values);
  }

  static toNumber(amount: string): string {
    return new BigNumber(amount).div(10**this.decimals).toFixed(16);
  }

  static toEther(amount: string): string {
    return new BigNumber(amount).div(10**18).toFixed(18);
  }

  static toBigNumber(amount: number): BigNumber {
    return new BigNumber(amount).multipliedBy(10**this.decimals);
  }

  static toWei(amount: string): BigNumber {
    return new BigNumber(amount).multipliedBy(10**18);
  }
}
