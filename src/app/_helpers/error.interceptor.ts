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
      catchError((error: HttpErrorResponse) => {
        const isRefreshTokenRequest = request.url.includes('/accounts/refresh-token');

        if (isRefreshTokenRequest) {
          return throwError(() => error);
        }

        if ([401, 403].includes(error.status) && this.accountService.accountValue) {
          this.accountService.logout();
        }

        const message =
          error.error?.message ||
          error.statusText ||
          'Something went wrong. Please try again.';

        this.alertService.error(message);

        return throwError(() => error);
      })
    );
  }
}