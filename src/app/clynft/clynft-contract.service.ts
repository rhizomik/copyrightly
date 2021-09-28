import { Injectable, NgZone } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { Observable } from 'rxjs/internal/Observable';
import { ReplaySubject } from 'rxjs';
import { Event } from '../util/event';
import { NFTMintEvent } from './nftmint-event';

declare const require: any;
const clynft = require('../../assets/contracts/CopyrightLYNFT.json');

@Injectable({
  providedIn: 'root'
})
export class CLYNFTContractService {

  private deployedContract = new ReplaySubject<any>(1);
  private watching = true; // Default try to watch events

  constructor(private web3Service: Web3Service,
              private ngZone: NgZone) {
    this.web3Service.networkId.subscribe((networkId: number) => {
      if (clynft.networks[networkId]) {
        const deployedAddress = clynft.networks[networkId].address;
        this.deployedContract.next(
          new this.web3Service.web3.eth.Contract(clynft.abi, deployedAddress));
      } else {
        this.deployedContract.error(new Error('CopyrightLY NFT contract ' +
          'not found in current network with id ' + networkId));
      }
    });
  }

  public getAmountMinted(account: string): Observable<string> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.methods.amountMinted(account).call()
        .then((result: string) => {
          this.ngZone.run(() => {
            observer.next(result);
            observer.complete();
          });
        })
        .catch((error: string) => {
          console.error(error);
          this.ngZone.run(() => {
            observer.error(new Error('Error retrieving amount minted by account, see log for details'));
            observer.complete();
          });
        });
      }, error => this.ngZone.run(() => { observer.error(error); observer.complete(); }));
      return { unsubscribe: () => {} };
    });
  }

  public mint(manifestationHash: string, metadataHash: string, account: string): Observable<string | NFTMintEvent> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        const method = contract.methods.mint(manifestationHash, metadataHash);
        const options = { from: account };
        this.web3Service.estimateGas(method,options).then(optionsWithGas => method.send(optionsWithGas)
          .on('transactionHash', (hash: string) =>
            this.ngZone.run(() => observer.next(hash)))
          .on('receipt', (receipt: any) => {
            const mintEvent = new NFTMintEvent(receipt.events.NFTMinted);
            this.web3Service.getBlockDate(receipt.events.Transfer.blockNumber)
            .subscribe(date => {
              this.ngZone.run(() => {
                mintEvent.when = date;
                if (!this.watching) { observer.next(mintEvent); } // If not watching, show event
                observer.complete();
              });
            });
          })
          .on('error', (error: string) => {
            this.ngZone.run(() => {
              console.log(error);
              observer.error(new Error('Error minting NFT, see log for details'));
              observer.complete();
            });
          })
        );
      }, error => this.ngZone.run(() => { observer.error(error); observer.complete(); }));
      return { unsubscribe: () => {} };
    });
  }

  public watchMintEvents(account: string): Observable<Event> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.events.NFTMinted({ filter: { to: account }, fromBlock: 'latest' },
          (error: string, event: any) => {
            if (error) {
              console.log('Not possible to watch NFT transfer events: ' + error);
              this.watching = false; // Not possible to watch for events
              this.ngZone.run(() => {
                observer.error(new Error(error.toString()));
              });
            } else {
              console.log('NFT Minted Event: ' + event);
              const mintEvent: NFTMintEvent = new NFTMintEvent(event);
              this.web3Service.getBlockDate(event.blockNumber)
              .subscribe((date: Date) => {
                this.ngZone.run(() => {
                  mintEvent.when = date;
                  observer.next(mintEvent);
                });
              });
            }
          });
      }, error => this.ngZone.run(() => { observer.error(error); observer.complete(); }));
      return { unsubscribe: () => {} };
    });
  }
}
