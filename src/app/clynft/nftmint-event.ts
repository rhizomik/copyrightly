import { Event } from '../util/event';
import { NFT } from './nft';

export class NFTMintEvent extends Event {
  what = new NFT();

  constructor(event: any) {
    super({ type: event.event, who: event.returnValues?.minter, where: event.transactionHash });
    if (event.returnValues && event.returnValues.tokenId) {
      this.what = new NFT(event.returnValues);
    }
  }
}
