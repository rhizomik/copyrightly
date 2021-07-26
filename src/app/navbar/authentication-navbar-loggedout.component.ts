import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-authentication-navbar-loggedout',
  templateUrl: './authentication-navbar-loggedout.component.html',
  styleUrls: ['./authentication-navbar.component.css']
})
export class AuthenticationNavbarLoggedOutComponent {

  @Output() login: EventEmitter<void> = new EventEmitter();

  constructor() {}

  connect() {
    this.login.emit();
  }
}
