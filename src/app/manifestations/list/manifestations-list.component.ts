import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { AlertsService } from '../../alerts/alerts.service';
import { Web3Service } from '../../util/web3.service';
import { ManifestationsContractService } from '../manifestations-contract.service';
import { AuthenticationService } from '../../navbar/authentication.service';
import { ManifestEvent } from '../manifest-event';

@Component({
  selector: 'app-manifestations-list',
  templateUrl: './manifestations-list.component.html',
  styleUrls: ['./manifestations-list.component.css']
})
export class ManifestationsListComponent implements OnInit, OnDestroy {

  public manifestationEvents: ManifestEvent[] = [];
  public all = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private web3Service: Web3Service,
              private manifestationsContractService: ManifestationsContractService,
              private alertsService: AlertsService,
              private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.authenticationService.getSelectedAccount()
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(filter(account => account !== ''))
      .pipe(mergeMap((account: string) =>
        this.manifestationsContractService.listManifestEvents(account)))
      .subscribe(events => {
            this.manifestationEvents = events;
          }, error => this.alertsService.error(error));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
