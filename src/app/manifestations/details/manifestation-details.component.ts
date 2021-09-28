import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertsService } from '../../alerts/alerts.service';
import { Manifestation } from '../manifestation';
import { Location } from '@angular/common';
import { ManifestationDetailsQueryService } from '../../query/manifestation-details.query.service';
import { UploadEvidenceListQueryService } from '../../query/upload-evidence-list.query.service';
import { UploadEvidence } from '../../evidence/uploadEvidence';
import { TransactionType } from '../../clytoken/clytoken';
import { ReuseTermsComponent } from './reuse-terms.component';
import { YouTubeEvidence } from '../../evidence/youtubeEvidence';
import { YouTubeEvidenceListQueryService, YTEvidenceListResponse } from '../../query/youtube-evidence-list.query.service';
import { VerificationRequest } from '../../evidence/verification-request';
import { ManifestationNFTsQueryService, ManifestationNFTsResponse } from '../../query/manifestation-nfts.query.service';
import { NFT } from '../../clynft/nft';
import { map } from 'rxjs/operators';
import { QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manifestation-details',
  templateUrl: './manifestation-details.component.html',
  styleUrls: ['./manifestation-details.component.css']
})
export class ManifestationDetailsComponent implements OnInit, OnDestroy {

  manifestation: Manifestation = new Manifestation();
  uploadEvidence: UploadEvidence[] = [];
  youTubeEvidence: YouTubeEvidence[] = [];
  addingUploadableEvidence = false;
  addingYouTubeEvidence = false;
  hidUploadEvidence = false;
  hidYouTubeEvidence = false;
  notFound = true;
  staking = false;
  hidAddStake = false;
  type = TransactionType.purchase;
  nfts: NFT[] = [];
  private watchNFTsQuery: QueryRef<ManifestationNFTsResponse> | undefined;
  private watchNFTsSubscription: Subscription = new Subscription();
  private watchYTEvidenceQuery: QueryRef<YTEvidenceListResponse> | undefined;
  private watchYTEvidenceSubscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private alertsService: AlertsService,
              private manifestationDetailsQuery: ManifestationDetailsQueryService,
              private uploadEvidenceListQuery: UploadEvidenceListQueryService,
              private youTubeEvidenceListQueryService: YouTubeEvidenceListQueryService,
              private manifestationNftsQueryService: ManifestationNFTsQueryService) {
    // Use received Manifestation if available, otherwise, fetch it
    this.manifestation = this.router.getCurrentNavigation()?.extras.state as Manifestation;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => this.loadManifestation(params.get('id')));
  }

  loadManifestation(manifestationHash: string | null) {
    this.manifestationDetailsQuery.fetch({ manifestationHash })
      .subscribe(({data}) => {
        const manifestation = new Manifestation(({...data.manifestations[0]}));
        if (manifestation.title) {
          this.manifestation = manifestation;
          this.notFound = false;
          this.loadUploadableEvidence();
          this.watchYTEvidenceSubscription = this.loadYouTubeEvidence();
          this.watchNFTsSubscription = this.loadNFTs();
        } else if (this.manifestation?.title) {
          this.notFound = false;
          this.loadUploadableEvidence();
          this.watchYTEvidenceSubscription = this.loadYouTubeEvidence();
          this.watchNFTsSubscription = this.loadNFTs();
        } else {
          this.alertsService.error('Manifestation not found: ' + manifestationHash, 0);
        }
      }, error => this.alertsService.error(error));
  }

  addingEvidence(): boolean {
    return this.addingUploadableEvidence || this.addingYouTubeEvidence;
  }

  loadUploadableEvidence(): void {
    this.uploadEvidenceListQuery.fetch({ evidenced: this.manifestation.hash })
      .subscribe(({data}) => {
        this.uploadEvidence = data.uploadEvidences.map((event) => new UploadEvidence({...event}));
      }, error => this.alertsService.error(error));
  }

  loadYouTubeEvidence(): Subscription {
    this.watchYTEvidenceQuery = this.youTubeEvidenceListQueryService.watch({ evidenced: this.manifestation.hash });
    return this.watchYTEvidenceQuery.valueChanges
      .pipe( map(response =>
        response.data.youTubeEvidences.map((event) => new YouTubeEvidence({...event}))))
      .subscribe((youTubeEvidence: YouTubeEvidence[]) => this.youTubeEvidence = youTubeEvidence,
        error => this.alertsService.error(error));
  }

  back() {
    this.location.back();
  }

  addedUploadEvidence(evidence: UploadEvidence) {
    this.addingUploadableEvidence = false;
    this.hidUploadEvidence = false;
    this.uploadEvidence.push(evidence);
    this.manifestation.evidenceCount++;
  }

  addedYouTubeEvidence(request: VerificationRequest) {
    this.addingYouTubeEvidence = false;
    this.hidYouTubeEvidence = false;
  }

  addedStake(amount: string) {
    if (amount === '0') {
      this.hidAddStake = true;
    } else {
      if (this.type === TransactionType.purchase) {
        this.manifestation.staked = this.manifestation.staked.plus(amount);
      } else {
        this.manifestation.staked = this.manifestation.staked.minus(amount);
      }
      this.staking = false;
      this.hidAddStake = false;
    }
  }

  mintNFT() {
    this.alertsService.modal(ReuseTermsComponent, this.manifestation);
  }

  refresh() {
    this.watchYTEvidenceQuery?.refetch();
    this.watchNFTsQuery?.refetch();
  }

  loadNFTs(): Subscription {
    this.watchNFTsQuery = this.manifestationNftsQueryService.watch({ hash: this.manifestation.hash });
    return this.watchNFTsQuery.valueChanges
      .pipe( map(response =>
        response.data.copyrightLYNFTs.map((event) => new NFT({...event}))))
      .subscribe((nfts: NFT[]) => this.nfts = nfts,
        error => this.alertsService.error(error));
  }

  ngOnDestroy() {
    this.watchYTEvidenceSubscription.unsubscribe();
    this.watchNFTsSubscription.unsubscribe();
  }
}
