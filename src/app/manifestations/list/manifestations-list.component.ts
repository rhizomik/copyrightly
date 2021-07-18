import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AlertsService } from '../../alerts/alerts.service';
import { Web3Service } from '../../util/web3.service';
import { AuthenticationService } from '../../navbar/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { ManifestationsListQueryService } from '../../query/manifestations-list.query.service';
import { Manifestation } from '../manifestation';

@Component({
  selector: 'app-manifestations-list',
  templateUrl: './manifestations-list.component.html',
  styleUrls: ['./manifestations-list.component.css']
})
export class ManifestationsListComponent implements OnInit, OnDestroy, OnChanges {

  @Input() manifester = '';
  public manifestations: Manifestation[] | null = null;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private web3Service: Web3Service,
              private alertsService: AlertsService,
              private authenticationService: AuthenticationService,
              private manifestationsListQuery: ManifestationsListQueryService) {}

  ngOnInit(): void {
    this.loadManifestations();
  }

  ngOnChanges() {
    this.loadManifestations();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private loadManifestations() {
    const filterAuthors = [];
    if (this.manifester) {
      filterAuthors.push(this.manifester);
    }
    this.manifestationsListQuery.watch({ authors: filterAuthors }).valueChanges
      .pipe( map(response => this.manifestations = response.data.manifestations.map(
        (manifestation: Manifestation ) => new Manifestation({...manifestation}))))
      .subscribe((manifestations: Manifestation[]) => {
        this.manifestations = manifestations;
      }, error => this.alertsService.error(error));
  }
}
