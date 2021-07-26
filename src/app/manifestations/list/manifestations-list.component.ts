import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AlertsService } from '../../alerts/alerts.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { QueryRef } from 'apollo-angular';
import { ManifestationsListQueryService, ManifestationsListResponse } from '../../query/manifestations-list.query.service';
import { Manifestation } from '../manifestation';

@Component({
  selector: 'app-manifestations-list',
  templateUrl: './manifestations-list.component.html',
  styleUrls: ['./manifestations-list.component.css']
})
export class ManifestationsListComponent implements OnInit, OnDestroy, OnChanges {

  @Input() manifester = '';
  public manifestations: Manifestation[] | null = null;
  private watchQuery: QueryRef<ManifestationsListResponse> | undefined;
  private watchSubscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute,
              private alertsService: AlertsService,
              private manifestationsListQuery: ManifestationsListQueryService) {}

  ngOnInit(): void {
    this.watchSubscription = this.loadManifestations();
  }

  ngOnChanges() {
    this.watchSubscription = this.loadManifestations();
  }

  ngOnDestroy() {
    this.watchSubscription.unsubscribe();
  }

  refreshList() {
    const filterAuthors = [];
    if (this.manifester) {
      filterAuthors.push(this.manifester);
    }
    this.watchQuery?.refetch({ authors: filterAuthors });
  }

  private loadManifestations(): Subscription {
    const filterAuthors = [];
    if (this.manifester) {
      filterAuthors.push(this.manifester);
    }
    this.watchQuery = this.manifestationsListQuery.watch({ authors: filterAuthors });
    return this.watchQuery.valueChanges
      .pipe( map(response => this.manifestations = response.data.manifestations.map(
        (manifestation: Manifestation ) => new Manifestation({...manifestation}))))
      .subscribe((manifestations: Manifestation[]) => {
        this.manifestations = manifestations;
      }, error => this.alertsService.error(error));
  }
}
