import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertsService } from '../../alerts/alerts.service';
import { CLYTokenDetailsQueryService } from '../../query/clytoken-details.query.service';
import { CLYToken } from '../clytoken';

@Component({
  selector: 'app-clytoken-details',
  templateUrl: './clytoken-details.component.html',
  styleUrls: ['./clytoken-details.component.css']
})
export class CLYTokenDetailsComponent implements OnInit, OnDestroy {

  clytoken: CLYToken = new CLYToken();

  constructor(private alertsService: AlertsService,
              private clyTokenDetailsQueryService: CLYTokenDetailsQueryService) {}

  ngOnInit(): void {
    this.clyTokenDetailsQueryService.fetch({ symbol: 'CLY' })
      .subscribe(({data}) => {
        if (data.erc20Tokens && data.erc20Tokens.length > 0) {
          this.clytoken = new CLYToken(({...data.erc20Tokens[0]}));
        } else {
          this.alertsService.error('Error retrieving information about CLY Token', 0);
        }
      }, error => this.alertsService.error(error));
  }

  ngOnDestroy(): void {}
}
