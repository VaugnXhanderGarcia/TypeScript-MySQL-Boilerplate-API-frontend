import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
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
  private routeSubscription?: Subscription;

  constructor(
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.subscription = this.alertService.onAlert()
      .subscribe(alert => {
        if (!alert.message) {
          this.alerts = [];
          return;
        }

        this.alerts = [alert];

        setTimeout(() => {
          this.removeAlert(alert);
        }, 3000);
      });

    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.alerts = [];
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
  }

  cssClass(alert: Alert) {
    if (!alert) return '';

    const classes = ['alert-floating'];

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