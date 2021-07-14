import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertsService } from '../../alerts/alerts.service';
import { Web3Service } from '../../util/web3.service';
import { ManifestationsContractService } from '../manifestations-contract.service';
import { AuthenticationService } from '../../navbar/authentication.service';
import { ManifestEvent } from '../manifest-event';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manifestations-list',
  templateUrl: './manifestations-list.component.html',
  styleUrls: ['./manifestations-list.component.css']
})
export class ManifestationsListComponent implements OnInit, OnDestroy, OnChanges {

  @Input() manifester = '';
  public manifestationEvents: ManifestEvent[] | null = null;
  public own = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private web3Service: Web3Service,
              private manifestationsContractService: ManifestationsContractService,
              private alertsService: AlertsService,
              private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.authenticationService.getSelectedAccount()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(account => {
        this.own = this.manifester === account;
      }, error => this.alertsService.error(error));
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
    this.manifestationsContractService.listManifestEvents(this.manifester)
      .subscribe((events: ManifestEvent[]) => {
        this.manifestationEvents = events;
      }, error => this.alertsService.error(error));
  }
}
