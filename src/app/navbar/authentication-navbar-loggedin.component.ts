import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Web3Service } from '../util/web3.service';
import { AuthenticationService } from './authentication.service';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ManifestationsContractService } from '../manifestations/manifestations-contract.service';
import { YouTubeEvidenceContractService } from '../evidence/youtube-evidence-contract.service';
import { UploadEvidenceContractService } from '../evidence/upload-evidence-contract.service';
import { AlertsService } from '../alerts/alerts.service';
import { ManifestEvent } from '../manifestations/manifest-event';
import { ManifestEventComponent } from '../manifestations/manifest-event.component';
import { YouTubeEvidenceEvent } from '../evidence/youtube-evidence-event';
import { YouTubeEvidenceEventComponent } from '../evidence/youtube-evidence-event.component';
import { UploadEvidenceEvent } from '../evidence/upload-evidence-event';
import { UploadEvidenceEventComponent } from '../evidence/upload-evidence-event.component';
import { CLYNFTContractService } from '../clynft/clynft-contract.service';
import { NFTMintEvent } from '../clynft/nftmint-event';
import { NFTMintEventComponent } from '../clynft/nftmint-event.component';

@Component({
  selector: 'app-authentication-navbar-loggedin',
  templateUrl: './authentication-navbar-loggedin.component.html',
  styleUrls: ['./authentication-navbar.component.css']
})
export class AuthenticationNavbarLoggedInComponent implements OnInit, OnDestroy {

  @Output() logout: EventEmitter<void> = new EventEmitter();
  @Output() currentUser: EventEmitter<string> = new EventEmitter();

  public accountId = '';
  public accountName: string | null = '';
  public accountsNames: string[] = [];
  public accounts: string[] = [];
  public currentNetwork = '';
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private router: Router,
              private web3Service: Web3Service,
              private authenticationService: AuthenticationService,
              private manifestationsContractService: ManifestationsContractService,
              private youTubeEvidencesContractService: YouTubeEvidenceContractService,
              private uploadEvidencesContractService: UploadEvidenceContractService,
              private clynftContractService: CLYNFTContractService,
              private alertsService: AlertsService) {}

  ngOnInit() {
    this.getCurrentNetwork()
      .subscribe((networkId: string) => this.currentNetwork = networkId);
    this.authenticationService.getAccounts()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(accounts =>  this.accounts = accounts );
    this.authenticationService.getSelectedAccount()
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(filter(account => account !== ''))
      .subscribe(account =>  {
        this.accountId = account;
        this.currentUser.emit(account);
        this.accountName = this.accountsNames[this.accounts.indexOf(this.accountId)];
        this.watchManifestEvents(account);
        // this.watchUploadEvidenceEvents(account);
        this.watchYouTubeEvidenceEvents(account);
        this.watchNFTMintEvents(account);
      });
    this.authenticationService.getAccountsNames()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(accountsNames =>  {
        this.accountsNames = accountsNames;
        this.accountName = this.accountsNames[this.accounts.indexOf(this.accountId)];
      });
  }

  refreshAccounts() {
    this.web3Service.monitorNetworkId();
    this.authenticationService.refreshAccounts();
  }

  onChange(selectedAccount: string) {
    this.authenticationService.setSelectedAccount(selectedAccount);
  }

  getCurrentNetwork(): Observable<string> {
    return this.web3Service.getNetworkName();
  }

  currentUserProfile() {
    this.router.navigate(['/creators', this.accountId]);
  }

  disconnect() {
    this.web3Service.disconnect();
    this.logout.emit();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private watchManifestEvents(account: string) {
    this.manifestationsContractService.watchManifestEvents(account)
      .pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged( // Avoid repeated event firing with Metamask
        (prev, curr) => prev?.when?.valueOf() === curr?.when?.valueOf()))
      .subscribe( (event: ManifestEvent) => {
        console.log(event);
        this.alertsService.modal(ManifestEventComponent, event);
      }, error => {
        console.log(error.toString());
      });
  }

  private watchYouTubeEvidenceEvents(account: string) {
    this.youTubeEvidencesContractService.watchEvidenceEvents(account)
      .pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged( // Avoid repeated event firing with Metamask
        (prev, curr) => prev?.when?.valueOf() === curr?.when?.valueOf()))
      .subscribe( (event: YouTubeEvidenceEvent) => {
        console.log(event);
        this.alertsService.modal(YouTubeEvidenceEventComponent, event);
      }, error => {
        console.log(error.toString());
      });
  }

  private watchUploadEvidenceEvents(account: string) {
    this.uploadEvidencesContractService.watchEvidenceEvents(account)
      .pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged( // Avoid repeated event firing with Metamask
        (prev, curr) => prev?.when?.valueOf() === curr?.when?.valueOf()))
      .subscribe( (event: UploadEvidenceEvent) => {
        console.log(event);
        this.alertsService.modal(UploadEvidenceEventComponent, event);
      }, error => {
        console.log(error.toString());
      });
  }

  private watchNFTMintEvents(account: string) {
    this.clynftContractService.watchMintEvents(account)
      .pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged( // Avoid repeated event firing with Metamask
        (prev, curr) => prev?.when?.valueOf() === curr?.when?.valueOf()))
      .subscribe( (event: NFTMintEvent) => {
        console.log(event);
        this.alertsService.modal(NFTMintEventComponent, event);
      }, error => {
        console.log(error.toString());
      });
  }
}
