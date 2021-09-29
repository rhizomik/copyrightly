import { Injectable } from '@angular/core';
import { Alert, AlertType } from './alert';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Injectable()
export class AlertsService {

  alertsSource = new Subject<Alert>();
  alerts$ = this.alertsSource.asObservable();

  constructor(private modalService: NgbModal) { }

  error(message: string, timeout?: number): void {
    this.alertsSource.next(new Alert(AlertType.danger, message, timeout));
    window.scrollTo(0, 0);
  }

  info(message: string, timeout?: number): void {
    this.alertsSource.next(new Alert(AlertType.info, message, timeout));
    window.scrollTo(0, 0);
  }

  success(message: string, timeout?: number): void {
    this.alertsSource.next(new Alert(AlertType.success, message, timeout));
    window.scrollTo(0, 0);
  }

  warning(message: string, timeout?: number): void {
    this.alertsSource.next(new Alert(AlertType.warning, message, timeout));
    window.scrollTo(0, 0);
  }

  modal(content: any, data: any): void {
    const modalRef = this.modalService.open(content);
    modalRef.componentInstance.data = data;
  }
}
