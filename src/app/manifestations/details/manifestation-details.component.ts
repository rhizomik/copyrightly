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
import { YouTubeEvidenceListQueryService } from '../../query/youtube-evidence-list.query.service';
import { VerificationRequest } from '../../evidence/verification-request';
import { ManifestationNFTsQueryService } from '../../query/manifestation-nfts.query.service';
import { NFT } from '../../clynft/nft';

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
          this.loadEvidence();
          this.loadNFTs();
        } else if (this.manifestation?.title) {
          this.notFound = false;
          this.loadEvidence();
          this.loadNFTs();
        } else {
          this.alertsService.error('Manifestation not found: ' + manifestationHash, 0);
        }
      }, error => this.alertsService.error(error));
  }

  addingEvidence(): boolean {
    return this.addingUploadableEvidence || this.addingYouTubeEvidence;
  }

  loadEvidence(): void {
    this.uploadEvidenceListQuery.fetch({ evidenced: this.manifestation.hash })
      .subscribe(({data}) => {
        this.uploadEvidence = data.uploadEvidences.map((event) => new UploadEvidence({...event}));
      }, error => this.alertsService.error(error));
    this.youTubeEvidenceListQueryService.fetch({ evidenced: this.manifestation.hash })
      .subscribe(({data}) => {
        this.youTubeEvidence = data.youTubeEvidences.map((event) => new YouTubeEvidence({...event}));
      }, error => this.alertsService.error(error));
  }

  loadNFTs(): void {
    this.manifestationNftsQueryService.fetch({ hash: this.manifestation.hash })
      .subscribe(({data}) => {
        this.nfts = data.copyrightLYNFTs.map((event) => new NFT({...event}));
      }, error => this.alertsService.error(error));
  }

  back() {
    this.location.back();
  }

  ngOnDestroy(): void {}

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
}
