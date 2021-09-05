import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import Web3 from 'web3';
import { environment } from '../../environments/environment';
import WalletConnectProvider from '@walletconnect/web3-provider';

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
      this.monitorNetworkId();
    } else if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
      this.monitorNetworkId();
    } else {
      this.isLocalNetworkAvailable().pipe(filter(isAvailable => !isAvailable)).subscribe(() => {
        const provider: any = new WalletConnectProvider({ infuraId: environment.infuraToken });
        provider.enable().then(() => {
          this.web3 = new Web3(provider);
          this.monitorNetworkId();
        });
      });
    }
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
                observer.next(enabledAccounts.map((account: string) => account.toLowerCase()));
                observer.complete();
              })
            ).catch((error: string) => console.log('Error: ' + error));
          } else {
            this.ngZone.run(() => {
              observer.next(accounts.map((account: string) => account.toLowerCase()));
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

  public monitorNetworkId() {
    if (this.web3) {
      this.web3.eth.net.getId()
        .then((networkId: number) => {
          this.networkId.next(networkId);
        })
        .catch((reason: string) => {
          console.error('No Web3 provider available, ' + reason);
        });
    } else {
      console.error('No Web3 provider available');
    }
  }

  public disconnect() {
    if (this.web3.currentProvider && this.web3.currentProvider.disconnect) {
      this.web3.currentProvider.disconnect();
    }
  }

  private isLocalNetworkAvailable(): Observable<boolean> {
    return new Observable((observer) => {
      if (!environment.production && TRUFFLE_CONFIG) { // Use local network defined by Truffle config in dev mode
        const localNode = (this.useWebSockets ? 'ws://' : 'http://') + TRUFFLE_CONFIG.networks.development.host + ':' +
          TRUFFLE_CONFIG.networks.development.port;
        console.log('Using Web3 for local node: ' + localNode);
        if (this.useWebSockets) {
          this.web3 = new Web3(new Web3.providers.WebsocketProvider(localNode));
        } else {
          this.web3 = new Web3(new Web3.providers.HttpProvider(localNode));
        }
        this.web3.eth.net.getId()
          .then((networkId: number) => {
            this.networkId.next(networkId);
            observer.next(true);
            observer.complete();
          })
          .catch((reason: string) => {
            console.error('No local Web3 provider available, ' + reason);
            observer.next(false);
            observer.complete();
          });
      } else {
        observer.next(false);
        observer.complete();
      }
    });
  }
}
