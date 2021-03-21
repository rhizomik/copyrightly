import { Component, NgZone, OnInit } from '@angular/core';
import { AlertsService } from './alerts.service';
import { Alert } from './alert';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  alerts: Alert[] = [];
  private alertTimeout = 7000;

  constructor(private alertsService: AlertsService,
              private ngZone: NgZone) { }

  ngOnInit(): void {
    this.alertsService.alerts$.subscribe(
      alert => {
        this.ngZone.runOutsideAngular(() => {
          alert.timerId = window.setTimeout(() => {
            this.ngZone.run(() => {
              this.close(alert);
            });
          }, this.alertTimeout);
        });
        this.ngZone.run(() => {
          this.alerts.push(alert);
        });
      });
  }

  close(alert: Alert): void {
    clearTimeout(alert.timerId);
    this.alerts = this.alerts.filter(x => x !== alert);
  }
}
