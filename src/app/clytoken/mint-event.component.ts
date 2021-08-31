import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MintEvent } from './mint-event';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manifestation-modal-content',
  template: `
      <div class="modal-header bg-success text-white">
          <h4 class="modal-title">Success<br/><small>CopyrightLY Token Minted</small></h4>
          <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
              <span aria-hidden="true">&times;</span>
          </button>
      </div>
      <div class="modal-body">
          <div class="card mb-4">
            <div class="card-block row m-1">
              <h5 class="card-title col-md-12 p-1">CopyrightLY Token</h5>
              <div class="col-md-12 p-1 mb-1">
                <h6 class="card-subtitle text-muted">Staked On</h6>
                <p class="card-text">{{data?.where}}</p>
              </div>
              <div class="col-md-12 p-1 mb-1">
                <h6 class="card-subtitle text-muted">Buyer</h6>
                <p class="card-text" title="{{data?.who}}">
                  {{data?.who}}
                </p>
              </div>
              <div class="col-md-6 p-1 mb-1">
                <h6 class="card-subtitle text-muted">Amount</h6>
                <p class="card-text">{{data?.what?.amount}} <span class="fas fa-copyright logo-icon"></span>LY</p>
              </div>
              <div class="col-md-6 p-1 mb-1">
                <h6 class="card-subtitle text-muted">Payed</h6>
                <p class="card-text">{{data?.what?.price}} <span class="fab fa-ethereum"></span></p>
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
export class MintEventComponent implements OnInit {
  @Input() data: MintEvent = new MintEvent({});

  constructor(public activeModal: NgbActiveModal,
              private router: Router) {}

  ngOnInit(): void {}

  close(): void {
    this.activeModal.dismiss();
  }
}
