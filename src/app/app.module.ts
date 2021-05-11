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
import { AuthenticationNavbarComponent } from './navbar/authentication-navbar.component';
import { ManifestationsModule } from './manifestations/manifestations.module';
import { AlertsModule } from './alerts/alerts.module';

@NgModule({
  declarations: [
    AppComponent, NavbarComponent, AboutComponent, AuthenticationNavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AlertsModule,
    Angulartics2Module.forRoot(),
    ManifestationsModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbAlertModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
