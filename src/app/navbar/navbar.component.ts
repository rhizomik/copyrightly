import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, flatMap, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public isCollapsed = true;
  public isAuthenticatedRoute = false;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.isCollapsed = true;
    this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute.snapshot.firstChild?.data))
      .subscribe(data => this.isAuthenticatedRoute = data?.isAuthenticated);
  }
}
