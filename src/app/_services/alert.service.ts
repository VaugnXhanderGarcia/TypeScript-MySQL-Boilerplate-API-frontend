import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Alert, AlertType, AlertOptions } from '../_models';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private subject = new Subject<Alert>();
  private defaultId = 'default-alert';
  private shownMessages = new Set<string>();

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

  clear(id = this.defaultId) {
    this.subject.next(new Alert({ id }));
    this.shownMessages.clear();
  }

  alert(alert: Alert) {
    alert.id = alert.id || this.defaultId;

    const key = `${alert.type}-${alert.message}`;

    if (this.shownMessages.has(key)) {
      return;
    }

    this.shownMessages.add(key);
    this.subject.next(alert);

    setTimeout(() => {
      this.shownMessages.delete(key);
    }, 4000);
  }
}