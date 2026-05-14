import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Alert, AlertType } from '../_models';
import { AlertService } from '../_services';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  standalone: false
})
export class AlertComponent implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  private subscription?: Subscription;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.subscription = this.alertService.onAlert()
      .subscribe(alert => {
        if (!alert.message) {
          this.alerts = [];
          return;
        }

        const exists = this.alerts.some(x =>
          x.message === alert.message &&
          x.type === alert.type
        );

        if (!exists) {
          this.alerts.push(alert);

          setTimeout(() => {
            this.removeAlert(alert);
          }, 3500);
        }
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
  }

  cssClass(alert: Alert) {
    if (!alert) return '';

    switch (alert.type) {
      case AlertType.Success:
        return 'toast-alert toast-success';
      case AlertType.Error:
        return 'toast-alert toast-error';
      case AlertType.Info:
        return 'toast-alert toast-info';
      case AlertType.Warning:
        return 'toast-alert toast-warning';
      default:
        return 'toast-alert';
    }
  }
}