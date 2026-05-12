import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Alert, AlertType } from '../_models';
import { AlertService } from '../_services';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  AlertType = AlertType;

  private subscription?: Subscription;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.subscription = this.alertService.onAlert().subscribe(alert => {
      if (!alert.message) {
        this.alerts = [];
        return;
      }

      const duplicate = this.alerts.find(x =>
        x.message === alert.message &&
        x.type === alert.type
      );

      if (duplicate) {
        return;
      }

      this.alerts.push(alert);

      if (alert.autoClose !== false) {
        setTimeout(() => this.removeAlert(alert), 4000);
      }
    });
  }

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}