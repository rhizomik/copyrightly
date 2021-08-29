import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertsService } from '../../alerts/alerts.service';
import { AuthenticationService } from '../../navbar/authentication.service';
import { Web3Service } from '../../util/web3.service';
import { Manifestation } from '../manifestation';
import { CLYTokenContractService } from '../../clytoken/clytoken-contract.service';
import { MintEventComponent } from '../../clytoken/mint-event.component';
import { BigNumber } from 'bignumber.js';
import { CLYToken, TransactionType } from '../../clytoken/clytoken';
import { BurnEventComponent } from '../../clytoken/burn-event.component';

@Component({
  selector: 'app-manifestation-stake',
  templateUrl: './manifestation-stake.component.html',
  styleUrls: ['./manifestation-stake.component.css']
})
export class ManifestationStakeComponent implements OnInit {
  @Input() type = TransactionType.purchase;
  @Input() manifestation = new Manifestation();
  @Output() cancel: EventEmitter<void> = new EventEmitter();
  @Output() done: EventEmitter<BigNumber> = new EventEmitter();

  account = '';
  stakable = '';
  item = '';
  amount = 1.000;
  staked = 0;
  maxPrice = '';

  constructor(private web3Service: Web3Service,
              private clyTokenContractService: CLYTokenContractService,
              private alertsService: AlertsService,
              private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.authenticationService.getSelectedAccount()
      .subscribe(account => {
        this.account = account;
        if (this.type === TransactionType.purchase) {
          this.getPurchasePrice(this.amount);
        } else {
          this.clyTokenContractService.getIndividualStake(this.manifestation.hash, this.account)
            .subscribe((result: string) => {
              this.staked = Number.parseFloat(result);
              this.amount = this.staked;
              this.getSellPrice(this.amount);
            });
        }
      } );
  }

  getPurchasePrice(amount: number) {
    if (amount > 0) {
      this.clyTokenContractService.getMintPrice(amount)
        .subscribe((result: string) => {
          this.maxPrice = result;
        });
    } else {
      this.maxPrice = '0';
    }
  }

  getSellPrice(amount: number) {
    this.clyTokenContractService.getBurnPrice(amount)
      .subscribe((result: string) => {
        this.maxPrice = result;
      });
  }

  addStake(amount: number, maxPrice: string) {
    this.clyTokenContractService.mint(amount, maxPrice, this.manifestation.contract, this.manifestation.hash, this.account)
      .subscribe(result => {
        if (typeof result === 'string') {
          console.log('Transaction hash: ' + result);
          this.alertsService.info('CLY mint submitted, you will be alerted when confirmed.<br>' +
            'Receipt: <a target="_blank" href="https://goerli.etherscan.io/tx/' + result + '">' + result + '</a>');
          this.done.emit(new BigNumber(0));
        } else {
          console.log(result);
          this.alertsService.modal(MintEventComponent, result);
          this.done.emit(CLYToken.toBigNumber(amount));
        }
      }, error => {
        this.alertsService.error(error);
        this.cancel.emit();
      });
  }

  removeStake(amount: number) {
    this.clyTokenContractService.burn(amount, this.manifestation.contract, this.manifestation.hash, this.account)
      .subscribe(result => {
        if (typeof result === 'string') {
          console.log('Transaction hash: ' + result);
          this.alertsService.info('CLY burn submitted, you will be alerted when confirmed.<br>' +
            'Receipt: <a target="_blank" href="https://goerli.etherscan.io/tx/' + result + '">' + result + '</a>');
          this.done.emit(new BigNumber(0));
        } else {
          console.log(result);
          this.alertsService.modal(BurnEventComponent, result);
          this.done.emit(CLYToken.toBigNumber(amount));
        }
      }, error => {
        this.alertsService.error(error);
        this.cancel.emit();
      });
  }

  cancelTransaction() {
    this.cancel.emit();
  }
}
