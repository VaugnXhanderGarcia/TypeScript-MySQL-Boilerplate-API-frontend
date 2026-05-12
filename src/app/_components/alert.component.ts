import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Alert, AlertType } from '../_models';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'alert',
  imports: [CommonModule],
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  private subscription?: Subscription;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.subscription = this.alertService.onAlert().subscribe(alert => {
      if (!alert.message) {
        this.alerts = [];
        return;
      }

      this.alerts = [alert];

      if (alert.autoClose !== false) {
        setTimeout(() => this.removeAlert(alert), 4000);
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
    if (!alert) {
      return '';
    }

    switch (alert.type) {
      case AlertType.Success:
        return 'alert-success';
      case AlertType.Error:
        return 'alert-danger';
      case AlertType.Info:
        return 'alert-info';
      case AlertType.Warning:
        return 'alert-warning';
      default:
        return 'alert-primary';
    }
  }
}