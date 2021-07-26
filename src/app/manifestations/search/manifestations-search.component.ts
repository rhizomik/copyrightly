import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertsService } from '../../alerts/alerts.service';
import { Manifestation } from '../manifestation';
import { ManifestationDetailsQueryService } from '../../query/manifestation-details.query.service';

@Component({
  selector: 'app-manifestations-search',
  templateUrl: './manifestations-search.component.html',
  styleUrls: ['./manifestations-search.component.css']
})
export class ManifestationsSearchComponent implements OnInit, OnDestroy {

  public manifestation = new Manifestation();

  constructor(private manifestationDetailsQuery: ManifestationDetailsQueryService,
              private alertsService: AlertsService) {}

  ngOnInit(): void { }

  getManifestation() {
    this.manifestationDetailsQuery.fetch({ manifestationId: this.manifestation.id })
      .subscribe(({data}) => {
        this.manifestation = new Manifestation(({...data.manifestation}));
        if (!this.manifestation.title) {
          this.alertsService.info('Content hash not found, unregistered');
        }
      }, error => {
        this.alertsService.error(error);
      });
  }

  ngOnDestroy() {}
}
