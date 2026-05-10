import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectorRef
} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

import { Alert, AlertType } from '../_models';
import { AlertService } from '../_services';

@Component({
  selector: 'alert',
  standalone: false,
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription!: Subscription;
  routeSubscription!: Subscription;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.alertSubscription = this.alertService.onAlert(this.id)
      .subscribe(alert => {
        if (!alert.message) {
          this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);
          this.alerts.forEach(x => delete x.keepAfterRouteChange);
          this.cd.detectChanges();
          return;
        }

        this.alerts.push(alert);
        this.cd.detectChanges();

        if (alert.autoClose) {
          setTimeout(() => this.removeAlert(alert), 3000);
        }
      });

    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.alertService.clear(this.id);
      }
    });
  }

  ngOnDestroy() {
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  removeAlert(alert: Alert) {
    if (!this.alerts.includes(alert)) return;

    if (this.fade) {
      alert.fade = true;
      this.cd.detectChanges();

      setTimeout(() => {
        this.alerts = this.alerts.filter(x => x !== alert);
        this.cd.detectChanges();
      }, 250);
    } else {
      this.alerts = this.alerts.filter(x => x !== alert);
      this.cd.detectChanges();
    }
  }

  cssClasses(alert: Alert) {
    if (!alert) return '';

    const classes = ['alert', 'alert-dismissible', 'mt-4', 'container'];

    const alertTypeClass = {
      [AlertType.Success]: 'alert-success',
      [AlertType.Error]: 'alert-danger',
      [AlertType.Info]: 'alert-info',
      [AlertType.Warning]: 'alert-warning'
    };

    classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
      classes.push('fade');
    }

    return classes.join(' ');
  }
}