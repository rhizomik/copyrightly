import {TestBed, inject} from '@angular/core/testing';
import {Web3Service} from './web3.service';

const TRUFFLE_CONFIG = require('../../../truffle-config');

describe('Web3Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Web3Service]
    });
  });

  it('should be created', inject([Web3Service], (service: Web3Service) => {
    expect(service).toBeTruthy();
  }));

  it('should set development local node as Web3 provider',
    inject([Web3Service], (service: Web3Service) => {
      if (service.useWebSockets) {
        const localNode = 'ws://' + TRUFFLE_CONFIG.networks.development.host + ':' +
          TRUFFLE_CONFIG.networks.development.port + '/';
        expect(service.web3.currentProvider.connection.url).toBe(localNode);
      } else {
        const localNode = 'http://' + TRUFFLE_CONFIG.networks.development.host + ':' +
          TRUFFLE_CONFIG.networks.development.port;
        expect(service.web3.currentProvider.host).toBe(localNode);
      }
    })
  );
});
