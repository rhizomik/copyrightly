import { Injectable, NgZone } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { Observable } from 'rxjs/internal/Observable';
import { Event } from '../util/event';
import { ManifestEvent } from './manifest-event';
import { Manifestation } from './manifestation';
import { ReplaySubject } from 'rxjs';

declare const require: any;
const manifestations = require('../../assets/contracts/Manifestations.json');

@Injectable({
  providedIn: 'root'
})
export class ManifestationsContractService {

  private deployedContract = new ReplaySubject<any>(1);
  private watching = false; // Default try to watch events

  constructor(private web3Service: Web3Service,
              private ngZone: NgZone) {
    this.web3Service.networkId.subscribe((networkId: number) => {
      if (manifestations.networks[networkId]) {
        const deployedAddress = manifestations.networks[networkId].address;
        this.deployedContract.next(
          new this.web3Service.web3.eth.Contract(manifestations.abi, deployedAddress));
      } else {
        this.deployedContract.error(new Error('Manifestations contract ' +
          'not found in current network with id ' + networkId));
      }
    });
  }

  public getManifestation(hash: string | null): Observable<Manifestation> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.methods.getManifestation(hash).call()
        .then((result: string[]) => {
          this.ngZone.run(() => {
            if (result) {
              observer.next(new Manifestation(
                {
                  hash, title: result[0], authors: result[1],
                  when: result[2], expiry: result[3]
                }));
            } else {
              observer.next(new Manifestation());
            }
            observer.complete();
          });
        })
        .catch((error: string) => {
          console.error(error);
          this.ngZone.run(() => {
            observer.error(new Error('Error retrieving manifestation, see logs for details'));
            observer.complete();
          });
        });
      }, error => this.ngZone.run(() => { observer.error(error); observer.complete(); }));
      return { unsubscribe: () => {} };
    });
  }

  public manifest(manifestation: Manifestation, account: string): Observable<string | ManifestEvent> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.methods.manifestAuthorship(manifestation.hash, manifestation.title)
        .send({from: account, gas: 150000})
        .on('transactionHash', (hash: string) =>
          this.ngZone.run(() => observer.next(hash)))
        .on('receipt', (receipt: any) => {
          const manifestEvent = new ManifestEvent(receipt.events.ManifestEvent);
          this.web3Service.getBlockDate(receipt.events.ManifestEvent.blockNumber)
          .subscribe(date => {
            this.ngZone.run(() => {
              manifestEvent.when = date;
              if (!this.watching) { observer.next(manifestEvent); } // If not watching, show event
              observer.complete();
            });
          });
        })
        .on('error', (error: string) => {
          this.ngZone.run(() => {
            observer.error(new Error('Error registering creation, see log for details'));
            observer.complete();
          });
        });
      }, error => this.ngZone.run(() => { observer.error(error); observer.complete(); }));
      return { unsubscribe: () => {} };
    });
  }

  public listManifestEvents(account: string|undefined): Observable<ManifestEvent[]> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        const options: any = {filter: {manifester: account}, fromBlock: 0};
        if (!account) {
          delete options.filter;
        }
        contract.getPastEvents('ManifestEvent', options)
        .then((events: any[]) => {
          observer.next(events.map((event: any) => {
            const manifestEvent = new ManifestEvent(event);
            this.web3Service.getBlockDate(event.blockNumber)
            .subscribe(date =>
              this.ngZone.run(() => manifestEvent.when = date)
            );
            return manifestEvent;
          }));
          observer.complete();
        })
        .catch((error: string) => {
          console.log(error);
          this.ngZone.run(() => {
            observer.error(new Error('Error listening to contract events, see log for details'));
            observer.complete();
          });
        });
      }, error => this.ngZone.run(() => { observer.error(error); observer.complete(); }));
      return { unsubscribe: () => {} };
    });
  }

  public getEvidenceCount(hash: string): Observable<number> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.methods.getEvidenceCount(hash).call()
        .then((result: number) => {
          this.ngZone.run(() => {
            observer.next(result);
            observer.complete();
          });
        })
        .catch((error: string) => {
          console.error(error);
          this.ngZone.run(() => {
            observer.error(new Error('Error retrieving evidence count, see logs for details'));
            observer.complete();
          });
        });
      }, error => this.ngZone.run(() => { observer.error(error); observer.complete(); }));
      return { unsubscribe: () => {} };
    });
  }

  public watchManifestEvents(account: string): Observable<Event> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.events.ManifestEvent({ filter: { manifester: account }, fromBlock: 'latest' },
          (error: string, event: any) => {
            if (error) {
              console.log('Not possible to watch manifest events: ' + error);
              this.watching = false; // Not possible to watch for events
              this.ngZone.run(() => {
                observer.error(new Error(error.toString()));
              });
            } else {
              console.log('Manifest Event: ' + event);
              const manifestEvent: ManifestEvent = new ManifestEvent(event);
              this.web3Service.getBlockDate(event.blockNumber)
              .subscribe((date: Date) => {
                this.ngZone.run(() => {
                  manifestEvent.when = date;
                  observer.next(manifestEvent);
                });
              });
            }
          });
      }, error => this.ngZone.run(() => { observer.error(error); observer.complete(); }));
      return { unsubscribe: () => {} };
    });
  }
}
