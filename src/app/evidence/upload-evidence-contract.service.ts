import { Injectable, NgZone } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { Observable } from 'rxjs/internal/Observable';
import { ReplaySubject } from 'rxjs';
import { UploadEvidence } from './uploadEvidence';
import { UploadEvidenceEvent } from './upload-evidence-event';
import { Event } from '../util/event';

declare const require: any;
const evidenceContract = require('../../assets/contracts/UploadEvidence.json');
const manifestations = require('../../assets/contracts/Manifestations.json');

@Injectable({
  providedIn: 'root'
})
export class UploadEvidenceContractService {

  private deployedContract = new ReplaySubject<any>(1);
  private manifestationsAddress = '';
  private watching = false; // Default try to watch events

  constructor(private web3Service: Web3Service,
              private ngZone: NgZone) {
    this.web3Service.networkId.subscribe((networkId: number) => {
      if (evidenceContract.networks[networkId]) {
        const deployedAddress = evidenceContract.networks[networkId].address;
        this.manifestationsAddress = manifestations.networks[networkId].address;
        this.deployedContract.next(
          new this.web3Service.web3.eth.Contract(evidenceContract.abi, deployedAddress));
      } else {
        this.deployedContract.error(new Error('UploadEvidences contract ' +
          'not found in current network with id ' + networkId));
      }
    });
  }

  public getEvidenceExistence(hash: string): Observable<boolean> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.methods.getEvidenceExistence(hash).call()
        .then((result: boolean) => {
          this.ngZone.run(() => {
            observer.next(result);
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

  public addEvidence(evidence: UploadEvidence, account: string): Observable<string | UploadEvidenceEvent> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        const method = contract.methods.addEvidence(this.manifestationsAddress, evidence.evidenced, evidence.id);
        const options = { from: account };
        this.web3Service.estimateGas(method,options).then(optionsWithGas => method.send(optionsWithGas)
          .on('transactionHash', (hash: string) =>
            this.ngZone.run(() => observer.next(hash) ))
          .on('receipt', (receipt: any) => {
            const evidenceEvent = new UploadEvidenceEvent(receipt.events.UploadEvidenceEvent);
            this.web3Service.getBlockDate(receipt.events.UploadEvidenceEvent.blockNumber)
            .subscribe(date => {
              this.ngZone.run(() => {
                evidenceEvent.when = date;
                evidenceEvent.what.creationTime = date;
                if (!this.watching) { observer.next(evidenceEvent); } // If not watching, show event
                observer.complete();
              });
            });
          })
          .on('error', (error: string) => {
            console.error(error);
            this.ngZone.run(() => {
              observer.error(new Error('Error registering evidence, see log for details'));
              observer.complete();
            });
          })
        );
      }, error => this.ngZone.run(() => { observer.error(error); observer.complete(); }));
      return { unsubscribe: () => {} };
    });
  }

  public watchEvidenceEvents(account: string): Observable<Event> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.events.UploadEvidenceEvent({ filter: { evidencer: account }, fromBlock: 'latest' },
          (error: string, event: any) => {
            if (error) {
              this.watching = false; // Not possible to watch for events
              this.ngZone.run(() => {
                observer.error(new Error(error.toString()));
              });
            } else {
              const evidenceEvent = new UploadEvidenceEvent(event);
              this.web3Service.getBlockDate(event.blockNumber)
              .subscribe(date => {
                this.ngZone.run(() => {
                  evidenceEvent.when = date;
                  observer.next(evidenceEvent);
                });
              });
            }
          });
      }, error => this.ngZone.run(() => { observer.error(error); observer.complete(); }));
      return { unsubscribe: () => {} };
    });
  }
}
