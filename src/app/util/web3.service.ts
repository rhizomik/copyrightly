import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import Web3 from 'web3';

declare let require: any;
declare let window: any;
const TRUFFLE_CONFIG = require('../../../truffle-config');

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  public useWebSockets = true;
  public web3: any;
  public networkId = new ReplaySubject<any>(1);

  constructor(private ngZone: NgZone) {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      if (TRUFFLE_CONFIG) { // Use local network defined by Truffle config
        if (this.useWebSockets) {
          const localNode = 'ws://' + TRUFFLE_CONFIG.networks.development.host + ':' +
            TRUFFLE_CONFIG.networks.development.port;
          console.log('Using Web3 for local node: ' + localNode);
          this.web3 = new Web3(new Web3.providers.WebsocketProvider(localNode));
        } else {
          const localNode = 'http://' + TRUFFLE_CONFIG.networks.development.host + ':' +
            TRUFFLE_CONFIG.networks.development.port;
          console.log('Using Web3 for local node: ' + localNode);
          this.web3 = new Web3(new Web3.providers.HttpProvider(localNode));
        }
      }
    }
    this.web3.eth.net.getId()
      .then((networkId: number) => {
        this.networkId.next(networkId);
      })
      .catch( () => { // No Web3 provider available
        console.error('No Web3 provider available');
      });
  }

  public getNetworkName(): Observable<string> {
    return this.networkId.pipe(map(network => {
      switch (network) {
        case 1: return 'MainNet';
        case 2: return 'Morden';
        case 3: return 'Ropsten';
        case 4: return 'Rinkeby';
        case 5: return 'Görli';
        default: return 'LocalNet';
      }
    }));
  }

  public getAccounts(): Observable<string[]> {
    return new Observable((observer) => {
      this.web3.eth.getAccounts()
        .then((accounts: []) => {
          if (accounts.length === 0) {
            // Request account access if needed
            window.ethereum.enable().then((enabledAccounts: []) =>
              this.ngZone.run(() => {
                if (!enabledAccounts) { enabledAccounts = []; }
                observer.next(enabledAccounts);
                observer.complete();
              })
            ).catch((error: string) => console.log('Error: ' + error));
          } else {
            this.ngZone.run(() => {
              observer.next(accounts);
              observer.complete();
            });
          }
        })
        .catch((error: string) => {
          console.error(error);
          this.ngZone.run(() => {
            observer.error(new Error('Retrieving accounts<br>' +
              'A Web3-enable browser or supporting the ' +
              '<a target="_blank" href="https://metamask.io">MetaMask</a> extension required'));
          });
        });
      return { unsubscribe: () => {} };
    });
  }

  public getBlockDate(blockNumber: number): Observable<Date> {
    return new Observable((observer) => {
      this.web3.eth.getBlock(blockNumber)
      .then((block: any) => {
        this.ngZone.run(() => {
          const date = block !== null ? new Date(block.timestamp * 1000) : new Date();
          observer.next(date);
          observer.complete();
        });
      })
      .catch((error: string) => {
        console.error(error);
        this.ngZone.run(() => {
          observer.error('Block date not retrieved, see log for details');
          observer.complete();
        });
      });
      return { unsubscribe: () => {} };
    });
  }
}
