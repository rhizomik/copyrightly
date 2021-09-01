import { BigNumber } from 'bignumber.js';

export enum TransactionType {
  purchase,
  sell
}

export class Account {
  id = '';
  staked = 0;

  constructor(values: Record<string, unknown> = {}) {
    if (values.hasOwnProperty('staked')) {
      values.staked = CLYToken.toNumber(values.staked as string);
    }
    Object.assign(this, values);
  }
}

export class CLYToken {
  static decimals = 16;
  static description = 'CopyrightLY Token';
  static symbol = 'CLY';
  static clyDecimals = new BigNumber(10).pow(CLYToken.decimals);
  static etherDecimals = new BigNumber(10).pow(18);
  id = '';
  amount = 0;
  balance = 0;
  supply = 0;
  price = 0;
  holders: Account[] = [];
  pricePoints: PricePoint[] = [];

  constructor(values: Record<string, unknown> = {}) {
    if (values.hasOwnProperty('amount')) {
      values.amount = CLYToken.toNumber(values.amount as string);
    }
    if (values.hasOwnProperty('price')) {
      values.price = CLYToken.toEther(values.price as string);
    }
    if (values.hasOwnProperty('supply')) {
      values.supply = CLYToken.toNumber(values.supply as string);
    }
    if (values.hasOwnProperty('balance')) {
      values.balance = CLYToken.toEther(values.balance as string);
    }
    if (values.hasOwnProperty('holders')) {
      values.holders = (values.holders as any[]).map(holder => new Account({...holder}));
    }
    if (values.hasOwnProperty('pricePoints')) {
      values.pricePoints = (values.pricePoints as any[]).map(pricePoint => new PricePoint({...pricePoint}));
    }
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

export class PricePoint {
  price = 0;
  amount = 0;
  type = '';
  supply = 0;
  balance = 0;
  timestamp = new Date();

  constructor(values: Record<string, unknown> = {}) {
    if (values.hasOwnProperty('price')) {
      values.price = CLYToken.toEther(values.price as string);
    }
    if (values.hasOwnProperty('amount')) {
      values.amount = CLYToken.toNumber(values.amount as string);
    }
    if (values.hasOwnProperty('type')) {
      if (values.type === TransactionType.purchase) {
        values.type = 'Purchase';
      } else {
        values.type = 'Sell';
      }
    }
    if (values.hasOwnProperty('supply')) {
      values.supply = CLYToken.toNumber(values.supply as string);
    }
    if (values.hasOwnProperty('balance')) {
      values.balance = CLYToken.toEther(values.balance as string);
    }
    if (values.hasOwnProperty('timestamp')) {
      values.timestamp = new Date(values.timestamp as number * 1000);
    }
    Object.assign(this, values);
  }
}
