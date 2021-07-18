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

  public manifest(manifestation: Manifestation, account: string): Observable<string | ManifestEvent> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.methods.manifestAuthorship(manifestation.id, manifestation.title)
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
