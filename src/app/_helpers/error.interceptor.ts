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
        const isAuthenticateRequest = request.url.includes('/authenticate');
        const isRegisterRequest = request.url.includes('/register');
        const isVerifyEmailRequest = request.url.includes('/verify-email');

        /*
          IMPORTANT:
          Do not show "Unauthorized" or logout when refresh-token fails.
          This prevents the app from showing an error immediately when opening the site.
        */
        if (isRefreshTokenRequest) {
          return throwError(() => err);
        }

        /*
          Only force logout when a protected route/API returns 401.
          Do not use this for refresh-token.
        */
        if (err.status === 401) {
          this.accountService.clearAccountOnly();

          this.alertService.error('Unauthorized. Please log in again.', {
            keepAfterRouteChange: true
          });

          return throwError(() => err);
        }

        /*
          For login/register/verify errors, show the backend message clearly.
        */
        if (isAuthenticateRequest || isRegisterRequest || isVerifyEmailRequest) {
          const authMessage =
            err.error?.message ||
            err.error?.title ||
            'Request failed. Please check your information and try again.';

          this.alertService.error(authMessage);

          return throwError(() => err);
        }

        /*
          General error handler.
        */
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