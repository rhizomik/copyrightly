import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbAlertModule, NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { Angulartics2Module } from 'angulartics2';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import { AuthenticationNavbarLoggedOutComponent } from './navbar/authentication-navbar-loggedout.component';
import { AuthenticationNavbarLoggedInComponent } from './navbar/authentication-navbar-loggedin.component';
import { ManifestationsModule } from './manifestations/manifestations.module';
import { AlertsModule } from './alerts/alerts.module';
import { CreatorsModule } from './creators/creators.module';

@NgModule({
  declarations: [
    AppComponent, NavbarComponent, AboutComponent, AuthenticationNavbarLoggedOutComponent, AuthenticationNavbarLoggedInComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbAlertModule,
    Angulartics2Module.forRoot(),
    AppRoutingModule,
    AlertsModule,
    ManifestationsModule,
    CreatorsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
