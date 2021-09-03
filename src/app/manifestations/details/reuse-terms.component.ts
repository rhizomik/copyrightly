import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Manifestation } from '../manifestation';

@Component({
  selector: 'app-reuse-terms-modal-content',
  template: `
      <div class="modal-header bg-success text-white">
          <h4 class="modal-title">Default Reuse Terms</h4>
          <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
              <span aria-hidden="true">&times;</span>
          </button>
      </div>
      <div class="modal-body">
          <div class="card mb-4">
              <div class="card-block row m-1">
                <pre>{{reuseTerms}}</pre>
              </div>
          </div>
      </div>
      <div class="modal-footer">
          <button type="button" ngbAutofocus class="btn btn-info" (click)="close()">Close</button>
      </div>
  `,
  styles: ['.modal-body { font-size: smaller; }']
})
export class ReuseTermsComponent implements OnInit {
  @Input() data: Manifestation = new Manifestation({});
  reuseTerms = '';

  constructor(public activeModal: NgbActiveModal,
              private router: Router) {}

  ngOnInit(): void {
    this.reuseTerms = `
      {
        "@context" : {
          "cro" : "https://rhizomik.net/ontologies/copyrightonto.owl#",
          "schema" : "https://schema.org/"
        },
        "@type" : "cro:Offer",
        "cro:when" : "${new Date().toISOString()}",
        "cro:who" : [
          {
            "@id" : "https://copyrightly.rhizomik.net/creators/${this.data.authors[0]}",
            "@type" : "schema:Person"
          } ],
        "cro:what" : {
          "@type" : "cro:MakeAvailable",
          "schema:startTime" : "${new Date().toISOString()}",
          "schema:endTime" : "${new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()}",
          "cro:what" : {
            "@id" : "https://copyrightly.rhizomik.net/manifestations/${this.data.hash}",
            "@type" : "cro:Manifestation",
            "schema:name" : "${this.data.title}"
          }
        }
      }
    `;
  }

  close(): void {
    this.activeModal.dismiss();
  }
}
