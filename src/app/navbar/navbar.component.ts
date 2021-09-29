import { Component, OnInit } from '@angular/core';
import { NavbarService } from './navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public isCollapsed = true;

  constructor(private navbarService: NavbarService) {}

  ngOnInit() {
    this.isCollapsed = true;
  }

  isLoggedIn(): boolean {
    return this.navbarService.isLoggedIn();
  }

  login(): void {
    this.navbarService.login();
  }

  logout(): void {
    this.navbarService.logout();
  }

  warningLoggedOut() {
    console.log('Logged out');
  }
}
