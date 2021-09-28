import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NFTMintEvent } from './nftmint-event';

@Component({
  selector: 'app-manifestation-modal-content',
  template: `
    <div class="modal-header bg-success text-white">
      <h4 class="modal-title">Success<br/><small>NFT Minted</small></h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="card mb-4">
        <div class="card-block row m-1">
          <div class="col-md-12 p-1 mb-1">
            <h6 class="card-subtitle text-muted">Identifier</h6>
            <p class="card-text small">{{data?.what?.tokenId}}</p>
          </div>
          <div class="col-md-12 p-1 mb-1">
            <h6 class="card-subtitle text-muted">Metadata</h6>
            <a class="card-text" href="https://ipfs.infura.io/{{data?.what?.tokenUri?.replace('://', '/')}}" target="_blank">
              {{data?.what?.tokenUri}}</a>
          </div>
          <div class="col-md-12 p-1 mb-1">
            <h6 class="card-subtitle text-muted">Licensing Manifestation</h6>
            <a class="card-text" [routerLink]="['/manifestations', data?.what?.manifestationHash]">
              {{data?.what?.manifestationHash}}</a>
          </div>
          <div class="col-md-6 p-1 mb-1">
            <h6 class="card-subtitle text-muted">By</h6>
            <p class="card-text" title="{{data?.who}}">
              {{data?.who | slice:0:6}}...{{data?.who | slice:-4}}
            </p>
          </div>
          <div class="col-md-6 p-1 mb-1">
            <h6 class="card-subtitle text-muted">When</h6>
            <p class="card-text">{{data?.when | date:'medium'}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" ngbAutofocus class="btn btn-info" (click)="close()">Close</button>
    </div>
  `,
  styles: ['.modal-body { font-size: smaller; }']
})
export class NFTMintEventComponent implements OnInit {
  @Input() data: NFTMintEvent = new NFTMintEvent({});

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void { }

  close(): void {
    this.activeModal.dismiss();
  }
}
