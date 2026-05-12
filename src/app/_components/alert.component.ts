import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: false,
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit, OnDestroy {
  alerts: any[] = [];
  alertSubscription!: Subscription;
  routeSubscription!: Subscription;

  constructor(
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.alertSubscription = this.alertService.onAlert()
      .subscribe(alert => {
        if (!alert) {
          this.alerts = [];
          return;
        }

        this.alerts.push(alert);
      });

    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);

        this.alerts.forEach(x => {
          x.keepAfterRouteChange = false;
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
    }

    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  removeAlert(alert: any) {
    this.alerts = this.alerts.filter(x => x !== alert);
  }

  cssClasses(alert: any) {
    if (!alert) return '';

    const classes = ['alert', 'alert-dismissable', 'mt-4', 'container'];

    const alertType = alert.type;

    if (alertType === 'success') {
      classes.push('alert-success');
    }

    if (alertType === 'error') {
      classes.push('alert-danger');
    }

    if (alertType === 'info') {
      classes.push('alert-info');
    }

    if (alertType === 'warning') {
      classes.push('alert-warning');
    }

    return classes.join(' ');
  }
}