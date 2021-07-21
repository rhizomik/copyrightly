import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Web3Service } from '../../util/web3.service';
import { AlertsService } from '../../alerts/alerts.service';
import { Manifestation } from '../manifestation';
import { Location } from '@angular/common';
import { ManifestationDetailsQueryService } from '../../query/manifestation-details.query.service';
import { UploadEvidenceListQueryService } from '../../query/upload-evidence-list.query.service';
import { UploadEvidence } from '../../evidence/uploadEvidence';

@Component({
  selector: 'app-manifestation-details',
  templateUrl: './manifestation-details.component.html',
  styleUrls: ['./manifestation-details.component.css']
})
export class ManifestationDetailsComponent implements OnInit, OnDestroy {

  manifestation: Manifestation = new Manifestation();
  uploadEvidence: UploadEvidence[] = [];
  addingUploadableEvidence = false;
  addingYouTubeEvidence = false;
  navigationSubscription: Subscription = new Subscription();
  notFound = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private web3Service: Web3Service,
              private alertsService: AlertsService,
              private manifestationDetailsQuery: ManifestationDetailsQueryService,
              private uploadEvidenceListQuery: UploadEvidenceListQueryService) {
    // Use passed Manifestation if available
    this.manifestation = this.router.getCurrentNavigation()?.extras.state as Manifestation;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => this.loadManifestation(params.get('id')));
    // Reload manifestation and evidence if page reloaded
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.route.paramMap.subscribe((params: ParamMap) => this.loadManifestation(params.get('id')));
      }
    });
  }

  loadManifestation(manifestationId: string | null) {
    this.manifestationDetailsQuery.fetch({ manifestationId })
      .subscribe(({data}) => {
        const manifestation = new Manifestation(({...data.manifestation}));
        if (manifestation.title) {
          this.manifestation = manifestation;
          this.notFound = false;
          this.loadEvidence();
        } else if (this.manifestation?.title) {
          this.notFound = false;
          this.loadEvidence();
        } else {
          this.alertsService.error('Manifestation not found: ' + manifestationId, 0);
        }
      }, error => this.alertsService.error(error));
  }

  addingEvidence(): boolean {
    return this.addingUploadableEvidence || this.addingYouTubeEvidence;
  }

  loadEvidence(): void {
    this.uploadEvidenceListQuery.fetch({ evidenced: this.manifestation.id })
    .subscribe(({data}) => {
      this.uploadEvidence = data.uploadEvidences.map((event) => new UploadEvidence({...event}));
    }, error => this.alertsService.error(error));
  }

  back() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.navigationSubscription.unsubscribe();
  }
}
