import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manifestations-search',
  templateUrl: './creators-search.component.html',
  styleUrls: ['./creators-search.component.css']
})
export class CreatorsSearchComponent implements OnInit, OnDestroy {

  account = '';

  constructor(private router: Router) {}

  ngOnInit(): void { }

  getCreator() {
    this.router.navigate(['/creators', this.account]);
  }

  ngOnDestroy() {}
}
