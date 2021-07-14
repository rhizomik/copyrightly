import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AlertsService } from '../../alerts/alerts.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-creator-details',
  templateUrl: './creator-details.component.html',
  styleUrls: ['./creator-details.component.css']
})
export class CreatorDetailsComponent implements OnInit, OnDestroy {

  creatorAccount = '';

  constructor(private route: ActivatedRoute,
              private location: Location,
              private alertsService: AlertsService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const creatorId = params.get('id');
      if (creatorId && creatorId.match('0x[a-fA-F0-9]{40}')) {
        this.creatorAccount = creatorId;
      } else {
        this.alertsService.error('An Ethereum account is expected as the creator identifier.' +
          '\n It starts with "0x" followed by 40 hexadecimal symbols (0-9 or A-F)', 0);
      }
    });
  }

  back() {
    this.location.back();
  }

  ngOnDestroy(): void {}
}
