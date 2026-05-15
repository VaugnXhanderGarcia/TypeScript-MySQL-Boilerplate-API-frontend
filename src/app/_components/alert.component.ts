import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Alert, AlertType } from '../_models';
import { AlertService } from '../_services';

@Component({
  selector: 'app-alert',
  standalone: false,
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  private subscription!: Subscription;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.subscription = this.alertService.onAlert().subscribe(alert => {
      if (!alert.message) {
        this.alerts = [];
        return;
      }

      this.alerts.push(alert);

      setTimeout(() => {
        this.removeAlert(alert);
      }, 3000);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
  }

  cssClass(alert: Alert) {
    if (!alert) {
      return;
    }

    const classes = ['alert', 'alert-dismissible', 'fade', 'show', 'shadow'];

    switch (alert.type) {
      case AlertType.Success:
        classes.push('alert-success');
        break;
      case AlertType.Error:
        classes.push('alert-danger');
        break;
      case AlertType.Info:
        classes.push('alert-info');
        break;
      case AlertType.Warning:
        classes.push('alert-warning');
        break;
    }

    return classes.join(' ');
  }
}