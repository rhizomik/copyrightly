export class NFT {
  static description = 'CopyrightLY NFT';
  static symbol = 'CLYNFT';
  tokenId = '';
  tokenUri = '';
  manifestations = '';
  manifestationHash = '';
  creationTime = new Date();
  minter = '';
  transaction = '';

  constructor(values: Record<string, unknown> = {}) {
    if (values.hasOwnProperty('creationTime')) {
      values.creationTime = new Date(values.creationTime as number * 1000);
    }
    if (values.hasOwnProperty('manifestation')) {
      values.manifestationHash = (values.manifestation as any).hash;
    }
    if (values.hasOwnProperty('minter')) {
      values.minter = (values.minter as any).id;
    }
    Object.assign(this, values);
  }
}
