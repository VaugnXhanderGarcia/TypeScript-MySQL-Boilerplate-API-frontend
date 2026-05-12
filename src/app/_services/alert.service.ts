import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Alert, AlertType, AlertOptions } from '../_models';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private subject = new Subject<Alert>();
  private defaultId = 'default-alert';

  // prevents repeated same alert spam
  private activeMessages = new Set<string>();

  onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject.asObservable().pipe(
      filter(x => x && x.id === id)
    );
  }

  success(message: string, options?: AlertOptions) {
    this.alert(new Alert({ ...options, type: AlertType.Success, message }));
  }

  error(message: string, options?: AlertOptions) {
    this.alert(new Alert({ ...options, type: AlertType.Error, message }));
  }

  info(message: string, options?: AlertOptions) {
    this.alert(new Alert({ ...options, type: AlertType.Info, message }));
  }

  warn(message: string, options?: AlertOptions) {
    this.alert(new Alert({ ...options, type: AlertType.Warning, message }));
  }

  alert(alert: Alert) {
    alert.id = alert.id || this.defaultId;

    const key = `${alert.id}-${alert.type}-${alert.message}`;

    // do not show the same alert repeatedly
    if (this.activeMessages.has(key)) {
      return;
    }

    this.activeMessages.add(key);
    this.subject.next(alert);

    // allow the same message again after 4 seconds
    setTimeout(() => {
      this.activeMessages.delete(key);
    }, 4000);
  }

  clear(id = this.defaultId) {
    this.subject.next(new Alert({ id }));
  }
}