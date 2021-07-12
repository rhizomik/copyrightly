import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-creator-details',
  templateUrl: './creator-details.component.html',
  styleUrls: ['./creator-details.component.css']
})
export class CreatorDetailsComponent implements OnInit, OnDestroy {

  creatorAccount = '';
  notFound = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => this.creatorAccount = params.get('id') || '');
  }

  ngOnDestroy(): void {}
}
