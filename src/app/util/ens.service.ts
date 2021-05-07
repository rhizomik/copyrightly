import { Injectable, NgZone } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Web3Service } from './web3.service';

const ENS = require('ethereum-ens');
declare const require: any;
const localENS = require('../../assets/contracts/ENSRegistry.json');

@Injectable({
  providedIn: 'root'
})
export class EnsService {

  private deployedContract = new ReplaySubject<any>(1);

  constructor(private web3Service: Web3Service,
              private ngZone: NgZone) {
    this.web3Service.networkId.subscribe((networkId: number) => {
      if (networkId > 4) {
        if (localENS.networks[networkId]) {
          const deployedAddress = localENS.networks[networkId].address;
          this.deployedContract.next(
            new ENS(this.web3Service.web3.eth.currentProvider, deployedAddress));
        } else {
          this.deployedContract.error(new Error('ENSRegistry contract ' +
            'not found in current network with id ' + networkId));
        }
      } else {
        this.deployedContract.next(new ENS(this.web3Service.web3.eth.currentProvider));
      }
    });
  }

  public reverse(address: string): Observable<string> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.reverse(address).name()
        .then((name: string) => {
          this.ngZone.run(() => {
            observer.next(name);
            observer.complete();
          });
        })
        .catch((error: string) => {
          this.ngZone.run(() => {
            observer.next(address.slice(0, 6) + '...' + address.slice(-4));
            observer.complete();
          });
        });
      }, error => this.ngZone.run(() => {
        observer.next(address.slice(0, 6) + '...' + address.slice(-4));
        observer.complete();
      }));
      return { unsubscribe: () => {} };
    });
  }
}
