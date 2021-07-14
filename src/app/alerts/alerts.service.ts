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
  }

  info(message: string, timeout?: number): void {
    this.alertsSource.next(new Alert(AlertType.info, message, timeout));
  }

  success(message: string, timeout?: number): void {
    this.alertsSource.next(new Alert(AlertType.success, message, timeout));
  }

  warning(message: string, timeout?: number): void {
    this.alertsSource.next(new Alert(AlertType.warning, message, timeout));
  }

  modal(content: any, data: any): void {
    const modalRef = this.modalService.open(content);
    modalRef.componentInstance.data = data;
  }
}
