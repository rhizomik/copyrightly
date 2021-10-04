import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertsService } from '../../alerts/alerts.service';
import { Manifestation } from '../manifestation';
import { Location } from '@angular/common';
import { NavbarService } from '../../navbar/navbar.service';
import { ManifestationDetailsQueryService, ManifestationsListResponse } from '../../query/manifestation-details.query.service';
import { UploadEvidenceListQueryService, UploadEvidenceListResponse } from '../../query/upload-evidence-list.query.service';
import { UploadEvidence } from '../../evidence/uploadEvidence';
import { TransactionType } from '../../clytoken/clytoken';
import { YouTubeEvidence } from '../../evidence/youtubeEvidence';
import { YouTubeEvidenceListQueryService, YTEvidenceListResponse } from '../../query/youtube-evidence-list.query.service';
import { VerificationRequest } from '../../evidence/verification-request';
import { ManifestationNFTsQueryService, ManifestationNFTsResponse } from '../../query/manifestation-nfts.query.service';
import { LicenseTermsComponent } from '../../clynft/license-terms.component';
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

  private watchManifestationQuery: QueryRef<ManifestationsListResponse> | undefined;
  private watchManifestationSubscription: Subscription = new Subscription();
  private watchNFTsQuery: QueryRef<ManifestationNFTsResponse> | undefined;
  private watchNFTsSubscription: Subscription = new Subscription();
  private watchUploadEvidenceQuery: QueryRef<UploadEvidenceListResponse> | undefined;
  private watchUploadEvidenceSubscription: Subscription = new Subscription();
  private watchYTEvidenceQuery: QueryRef<YTEvidenceListResponse> | undefined;
  private watchYTEvidenceSubscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private alertsService: AlertsService,
              private navbarService: NavbarService,
              private manifestationDetailsQuery: ManifestationDetailsQueryService,
              private uploadEvidenceListQuery: UploadEvidenceListQueryService,
              private youTubeEvidenceListQueryService: YouTubeEvidenceListQueryService,
              private manifestationNftsQueryService: ManifestationNFTsQueryService) {
    // Use received Manifestation if available, otherwise, fetch it
    this.manifestation = this.router.getCurrentNavigation()?.extras.state as Manifestation;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) =>
      this.watchManifestationSubscription = this.loadManifestation(params.get('id')));
  }

  loadManifestation(manifestationHash: string | null): Subscription {
    this.watchManifestationQuery = this.manifestationDetailsQuery.watch({ manifestationHash });
    return this.watchManifestationQuery.valueChanges
      .pipe( map(response => new Manifestation(({...response.data.manifestations[0]}))))
      .subscribe((manifestation: Manifestation) => {
        if (!manifestation.title && !this.manifestation?.title) {
          this.notFound = true;
          this.alertsService.error('Manifestation not found: ' + manifestationHash, 0);
          return;
        } else {
          if (manifestation.title) {
            this.manifestation = manifestation;
          }
          this.notFound = false;
          if (!this. watchUploadEvidenceQuery && !this.watchYTEvidenceQuery && !this.watchNFTsQuery) {
            this.watchUploadEvidenceSubscription = this.loadUploadableEvidence();
            this.watchYTEvidenceSubscription = this.loadYouTubeEvidence();
            this.watchNFTsSubscription = this.loadNFTs();
          }
        }
      }, error => this.alertsService.error(error));
  }

  addingEvidence(): boolean {
    return this.addingUploadableEvidence || this.addingYouTubeEvidence;
  }

  loadUploadableEvidence(): Subscription {
    this.watchUploadEvidenceQuery = this.uploadEvidenceListQuery.watch({ evidenced: this.manifestation.hash });
    return this.watchUploadEvidenceQuery.valueChanges
      .pipe( map(response =>
        response.data.uploadEvidences.map((event) => new UploadEvidence({...event}))))
      .subscribe((uploadEvidence: UploadEvidence[]) => this.uploadEvidence = uploadEvidence,
          error => this.alertsService.error(error));
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
    if (!this.navbarService.isLoggedIn()) {
      this.alertsService.warning('Connect your account to be able to mint NFTs');
      return;
    }
    this.alertsService.modal(LicenseTermsComponent, this.manifestation);
  }

  refresh() {
    this.watchManifestationQuery?.refetch();
    this.watchUploadEvidenceQuery?.refetch();
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
    this.watchManifestationSubscription.unsubscribe();
    this.watchUploadEvidenceSubscription.unsubscribe();
    this.watchYTEvidenceSubscription.unsubscribe();
    this.watchNFTsSubscription.unsubscribe();
  }

  addUploadableEvidence() {
    if (!this.navbarService.isLoggedIn()) {
      this.alertsService.warning('Connect your account to be able to add uploadable evidence');
      return;
    }
    this.addingUploadableEvidence = true;
  }

  addYouTubeEvidence() {
    if (!this.navbarService.isLoggedIn()) {
      this.alertsService.warning('Connect your account to be able to add YouTube evidence');
      return;
    }
    this.addingYouTubeEvidence = true;
  }

  addStake() {
    if (!this.navbarService.isLoggedIn()) {
      this.alertsService.warning('Connect your account to be able to add stake');
      return;
    }
    this.staking = true;
    this.type = 0;
  }

  removeStake() {
    if (!this.navbarService.isLoggedIn()) {
      this.alertsService.warning('Connect your account to be able to remove your stake');
      return;
    }
    this.staking = true;
    this.type = 1;
  }
}
