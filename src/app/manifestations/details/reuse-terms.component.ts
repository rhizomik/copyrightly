import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Manifestation } from '../manifestation';
import { Web3Service } from '../../util/web3.service';
import { IpfsService } from '../../util/ipfs.service';
import { AlertsService } from '../../alerts/alerts.service';
import { AuthenticationService } from '../../navbar/authentication.service';
import { CLYNFTContractService } from '../../clynft/clynft-contract.service';
import { NFTMintEventComponent } from '../../clynft/nftmint-event.component';
import Web3 from 'web3';

@Component({
  selector: 'app-reuse-terms-modal-content',
  template: `
    <div class="modal-header bg-success text-white">
      <h4 class="modal-title">Mint CopyrightLY NFT</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <form id="nft-form" (ngSubmit)="mint()" #nftForm="ngForm">
      <fieldset>
        <div class="modal-body">
          <p>Mint an NFT granting its owner the following reuse terms:</p>
          <!-- Who select -->
          <div class="form-group" [class.was-validated]="inputWho.dirty || inputWho.touched">
            <label class="control-label" for="inputWho"><span class="fa fa-user"></span> Who</label>
            <input id="inputWho" name="inputWho" type="text" class="form-control" disabled
                   [ngModel]="who" #inputWho="ngModel">
          </div>
          <!-- Action input -->
          <div class="form-group" [class.was-validated]="inputAction.dirty || inputAction.touched">
            <label class="control-label" for="inputWho"><span class="fa fa-gavel"></span> Action</label>
            <input id="inputAction" name="inputAction" type="text" class="form-control" disabled
                   [ngModel]="action" #inputAction="ngModel">
          </div>
          <!-- What input -->
          <div class="form-group" [class.was-validated]="inputWhat.dirty || inputWhat.touched">
            <label class="control-label" for="inputWhat"><span class="fa fa-video"></span> What</label>
            <input id="inputWhat" name="inputWhat" type="text" class="form-control" disabled
                   [ngModel]="data.title" #inputWhat="ngModel">
          </div>
          <!-- With input -->
          <div class="form-group" [class.was-validated]="inputWith.dirty || inputWith.touched">
            <label class="control-label" for="inputWith"><span class="fa fa-desktop"></span> With</label>
            <input id="inputWith" name="inputWith" type="text" class="form-control" disabled
                   [ngModel]="with" #inputWith="ngModel">
          </div>
          <!-- Where input -->
          <div class="form-group" [class.was-validated]="inputWhere.dirty || inputWhere.touched">
            <label class="control-label" for="inputWhere"><span class="fa fa-globe-africa"></span> Where</label>
            <input id="inputWhere" name="inputWhere" type="text" class="form-control" disabled
                   [ngModel]="where" #inputWhere="ngModel">
          </div>
          <!-- When input -->
          <div class="form-group" [class.was-validated]="inputWhen.dirty || inputWhen.touched">
            <label class="control-label" for="inputWhen"><span class="fa fa-clock"></span> When</label>
            <input id="inputWhen" name="inputWhen" type="text" class="form-control" disabled
                   [ngModel]="when | date:'medium'" #inputWhen="ngModel">
          </div>
          <!-- Until input -->
          <div class="form-group" [class.was-validated]="inputUntil.dirty || inputUntil.touched">
            <label class="control-label" for="inputUntil"><span class="fa fa-hourglass-end"></span> Until</label>
            <input id="inputUntil" name="inputUntil" type="text" class="form-control" disabled
                   [ngModel]="until | date:'medium'" #inputUntil="ngModel">
          </div>
        </div>
        <div class="modal-footer">
          <small class="card-text col-md-12 p-1 alert-warning" *ngIf="!data.authors.includes(account)">
            <b>Minting disabled</b><br/>Just the authors of the manifestation can mint NFTs licensing it.</small>
          <button id="mint" type="submit" class="btn btn-success pull-right" ngbAutofocus
            [disabled]="!data.authors.includes(account)">Mint NFT</button>
          <button type="button" class="btn btn-danger pull-right ml-2" (click)="close()">Cancel</button>
        </div>
      </fieldset>
    </form>
  `,
  styles: ['.modal-body { font-size: smaller; }']
})
export class ReuseTermsComponent implements OnInit {
  @Input() data: Manifestation = new Manifestation({});
  account = '';
  tokenId = '';
  who = 'NFT owner';
  action = 'Make Available';
  with = 'World Wide Web';
  where = 'Worldwide';
  when = new Date();
  until = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  constructor(public activeModal: NgbActiveModal,
              private web3Service: Web3Service,
              private ipfsService: IpfsService,
              private alertsService: AlertsService,
              private authenticationService: AuthenticationService,
              private clynftContractService: CLYNFTContractService) {
  }

  ngOnInit(): void {
    this.authenticationService.getSelectedAccount().subscribe((account: string) => {
        this.account = account;
        this.clynftContractService.getAmountMinted(account).subscribe((amountMinted: string) => {
          const packaged = Web3.utils.encodePacked(account, amountMinted);
          if (packaged) {
            this.tokenId = Web3.utils.toBN(Web3.utils.keccak256(packaged)).toString();
            console.log('TokenId:', this.tokenId);
          }
        });
      } );
  }

  mint(): void {
    this.ipfsService.saveToIpfs(this.metadata(), true).subscribe((metadataHash: string) => {
      this.clynftContractService.mint(this.data.hash, metadataHash, this.account)
        .subscribe(result => {
          if (typeof result === 'string') {
            console.log('Transaction hash: ' + result);
            this.alertsService.info('Evidence request submitted, you will be alerted when confirmed.<br>' +
              'Receipt: <a target="_blank" href="https://rinkeby.etherscan.io/tx/' + result + '">' + result + '</a>');
          } else {
            console.log(result);
            this.alertsService.modal(NFTMintEventComponent, result);
          }
          this.activeModal.dismiss();
        }, error => {
          this.alertsService.error(error);
        });
    });
  }

  close(): void {
    this.activeModal.dismiss();
  }

  private metadata(): string {
    return `
{
  "@context": {
    "@vocab": "https://schema.org/",
    "cro": "https://rhizomik.net/ontologies/copyrightonto.owl#",
    "external_link": "https://opensea.io/metadata/external_link",
    "animation_url": "https://opensea.io/metadata/animation_url",
    "youtube_url": "https://opensea.io/metadata/youtube_url"
  },
  "@id": "https://rinkeby.etherscan.io/token/${this.clynftContractService.address}?a=${this.tokenId}",
  "@type": "cro:Agree",
  "name": "Reuse license for '${this.data.title}'",
  "description": "Grants the owner permission to make the content available under the specified conditions",
  "external_link": "https://copyrightly.rhizomik.net/manifestations/${this.data.hash}",
  "image": "ipfs://${this.data.hash}",
  "animation_url": "ipfs://${this.data.hash}",
  "cro:when": "${this.when.toISOString()}",
  "cro:who": {
    "@id": "did:ethr:${this.data.authors[0]}",
    "url": "https://copyrightly.rhizomik.net/creators/${this.data.authors[0]}" },
  "cro:what": {
    "@type": "cro:MakeAvailable",
    "startTime": "${this.when.toISOString()}",
    "endTime": "${this.until.toISOString()}",
    "cro:who": {
      "owns": "https://rinkeby.etherscan.io/token/${this.clynftContractService.address}?a=${this.tokenId}" },
    "cro:what": {
      "@id": "ipfs://${this.data.hash}",
      "@type": "cro:Manifestation",
      "name": "${this.data.title}",
      "@id": "https://copyrightly.rhizomik.net/manifestations/${this.data.hash}",
    }
  }
}`;
  }
}
