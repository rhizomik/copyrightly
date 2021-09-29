import { Injectable } from '@angular/core';
import { AlertsService } from '../alerts/alerts.service';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  private loggedIn = false;

  constructor(private alertsService: AlertsService) {}

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public login(): void {
    this.loggedIn = true;
  }

  public logout(): void {
    this.loggedIn = false;
  }
}
