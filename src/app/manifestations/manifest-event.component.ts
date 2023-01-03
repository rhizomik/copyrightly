import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ManifestEvent } from './manifest-event';
import { Router } from '@angular/router';
import { ManifestationsContractService } from './manifestations-contract.service';
import { Manifestation } from './manifestation';

@Component({
  selector: 'app-manifestation-modal-content',
  template: `
      <div class="modal-header bg-success text-white">
          <h4 class="modal-title">Success<br/><small>Manifestation Registered</small></h4>
          <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
              <span aria-hidden="true">&times;</span>
          </button>
      </div>
      <div class="modal-body">
          <div class="card mb-4">
              <div class="card-block row m-1">
                  <h5 class="card-title col-md-12 p-1">{{data?.what?.title}}</h5>
                  <div class="col-md-12 p-1 mb-1">
                      <h6 class="card-subtitle text-muted">Hash</h6>
                      <a class="card-text" href="https://gateway.ipfs.io/ipfs/{{data?.what?.id}}" target="_blank">
                          {{data?.what?.id}}</a>
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
          <button type="button" ngbAutofocus class="btn btn-info" (click)="details()">Details</button>
      </div>
  `,
  styles: ['.modal-body { font-size: smaller; }']
})
export class ManifestEventComponent implements OnInit {
  @Input() data: ManifestEvent = new ManifestEvent({});

  constructor(public activeModal: NgbActiveModal,
              private router: Router,
              private manifestationsContractService: ManifestationsContractService) {}

  ngOnInit(): void {
    this.manifestationsContractService.getManifestation(this.data.what.id)
      .subscribe((manifestation: Manifestation) => {
        this.data.what = manifestation;
        this.data.what.transaction = this.data.where;
    });
  }

  details(): void {
    this.activeModal.dismiss();
    if (this.data) {
      this.router.navigate(['/manifestations', this.data.what.id], { state: this.data.what });
    }
  }
}
