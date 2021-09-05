import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AlertsService } from '../../alerts/alerts.service';
import { Location } from '@angular/common';
import { AccountStakesDetailsQueryService } from '../../query/account-stakes.query.service';
import { Account } from '../../clytoken/clytoken';

@Component({
  selector: 'app-creator-details',
  templateUrl: './creator-details.component.html',
  styleUrls: ['./creator-details.component.css']
})
export class CreatorDetailsComponent implements OnInit, OnDestroy {

  accountId = '';
  account: Account = new Account();

  constructor(private route: ActivatedRoute,
              private location: Location,
              private alertsService: AlertsService,
              private accountStakesDetailsQueryService: AccountStakesDetailsQueryService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id && id.match('0x[a-fA-F0-9]{40}')) {
        this.accountId = id;
      } else {
        this.alertsService.error('An Ethereum account is expected as the creator identifier.' +
          '\n It starts with "0x" followed by 40 hexadecimal symbols (0-9 or A-F)', 0);
      }
    });
    this.accountStakesDetailsQueryService.fetch({ id: this.accountId })
      .subscribe(({data}) => {
        if (data.account) {
          this.account = new Account(({...data.account}));
        } else {
          this.alertsService.error('Error retrieving information for Ethereum account', 0);
        }
      }, error => this.alertsService.error(error));
  }

  back() {
    this.location.back();
  }

  ngOnDestroy(): void {}
}
