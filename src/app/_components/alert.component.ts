import { Component, OnDestroy, OnInit } from '@angular/core';
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
  private subscription?: Subscription;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.subscription = this.alertService.onAlert().subscribe(alert => {
      if (!alert.message) {
        this.alerts = [];
        return;
      }

      this.alerts = [alert];
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
        return 'toast-success';
      case AlertType.Error:
        return 'toast-error';
      case AlertType.Info:
        return 'toast-info';
      case AlertType.Warning:
        return 'toast-warning';
      default:
        return 'toast-info';
    }
  }
}