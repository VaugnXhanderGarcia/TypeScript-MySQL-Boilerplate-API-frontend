import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AccountService, AlertService } from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        const isRefreshTokenRequest = request.url.includes('/refresh-token');

        if (err.status === 401 && !isRefreshTokenRequest) {
          if (!isRefreshTokenRequest) {
            this.accountService.logout();
            this.alertService.error('Unauthorized. Please login again.');
          }

          return throwError(() => err);
        }

        const message =
          err.error?.message ||
          err.error?.title ||
          err.message ||
          'Something went wrong. Please try again.';

        this.alertService.error(message);

        return throwError(() => err);
      })
    );
  }
}