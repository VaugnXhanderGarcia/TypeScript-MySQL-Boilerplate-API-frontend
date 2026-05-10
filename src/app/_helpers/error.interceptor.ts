import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertService } from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private alertService: AlertService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        const error = err.error?.message || err.statusText || 'Something went wrong';

        if (err.status === 403) {
          this.alertService.error('Admin access only.');
        }

        if (err.status === 401) {
          this.alertService.error('Unauthorized. Please login again.');
        }

        return throwError(() => error);
      })
    );
  }
}