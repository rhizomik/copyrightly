import { Event } from '../util/event';
import { CLYToken } from './clytoken';

export class BurnEvent extends Event {
  what = new CLYToken();

  constructor(event: any) {
    super({ type: event.event, who: event.returnValues?.seller, where: event.returnValues?.item });
    if (event.returnValues && event.returnValues.amount && event.returnValues.earned) {
      this.what = new CLYToken({
        amount: CLYToken.toNumber(event.returnValues.amount),
        price: CLYToken.toEther(event.returnValues.earned)
      });
    }
  }
}
