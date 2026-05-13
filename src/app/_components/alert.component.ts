import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Alert, AlertType } from '../_models';
import { AlertService } from '../_services';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  subscription?: Subscription;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.subscription = this.alertService.onAlert()
      .subscribe(alert => {
        if (!alert.message) {
          this.alerts = [];
          return;
        }

        this.alerts = this.alerts.filter(x => x.message !== alert.message);
        this.alerts.push(alert);

        setTimeout(() => {
          this.removeAlert(alert);
        }, 3500);
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

    const classes = ['custom-toast'];

    switch (alert.type) {
      case AlertType.Success:
        classes.push('custom-toast-success');
        break;
      case AlertType.Error:
        classes.push('custom-toast-error');
        break;
      case AlertType.Info:
        classes.push('custom-toast-info');
        break;
      case AlertType.Warning:
        classes.push('custom-toast-warning');
        break;
    }

    return classes.join(' ');
  }
}