import { Injectable, NgZone } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { Observable } from 'rxjs/internal/Observable';
import { ReplaySubject } from 'rxjs';
import { MintEvent } from './mint-event';
import Utils from 'web3-utils';
import { CLYToken } from './clytoken';

declare const require: any;
const clytoken = require('../../assets/contracts/CLYToken.json');

@Injectable({
  providedIn: 'root'
})
export class CLYTokenContractService {

  private deployedContract = new ReplaySubject<any>(1);
  private watching = false; // Default try to watch events

  constructor(private web3Service: Web3Service,
              private ngZone: NgZone) {
    this.web3Service.networkId.subscribe((networkId: number) => {
      if (clytoken.networks[networkId]) {
        const deployedAddress = clytoken.networks[networkId].address;
        this.deployedContract.next(
          new this.web3Service.web3.eth.Contract(clytoken.abi, deployedAddress));
      } else {
        this.deployedContract.error(new Error('CLYToken contract ' +
          'not found in current network with id ' + networkId));
      }
    });
  }

  public getMintPrice(amount: number): Observable<string> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.methods.getMintPrice(CLYToken.toBigNumber(amount)).call()
          .then((result: any) => {
            this.ngZone.run(() => {
              if (result) {
                observer.next(Number.parseFloat(Utils.fromWei(result, 'ether')).toFixed(18));
              } else {
                observer.next();
              }
              observer.complete();
            });
          })
          .catch((error: string) => {
            console.error(error);
            this.ngZone.run(() => {
              observer.error(new Error('Error retrieving CLY price, see logs for details'));
              observer.complete();
            });
          });
      }, error => this.ngZone.run(() => { observer.error(error); observer.complete(); }));
      return { unsubscribe: () => {} };
    });
  }

  public mint(amount: number, maxPrice: string, stakable: string, item: string, account: string): Observable<string | MintEvent> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.methods.mint(CLYToken.toBigNumber(amount), CLYToken.toWei(maxPrice), stakable, item)
        .send({value: CLYToken.toWei(maxPrice), from: account, gas: 150000})
        .on('transactionHash', (hash: string) =>
          this.ngZone.run(() => observer.next(hash)))
        .on('receipt', (receipt: any) => {
          const mintEvent = new MintEvent(receipt.events.Minted);
          if (!this.watching) { observer.next(mintEvent); } // If not watching, show event
          observer.complete();
        })
        .on('error', (error: string) => {
          this.ngZone.run(() => {
            observer.error(new Error('Error minting CLY, see log for details'));
            console.log(error);
            observer.complete();
          });
        });
      }, error => this.ngZone.run(() => { observer.error(error); observer.complete(); }));
      return { unsubscribe: () => {} };
    });
  }
}
