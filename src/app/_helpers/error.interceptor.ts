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
        const isRefreshTokenRequest = request.url.includes('/accounts/refresh-token');

        if (isRefreshTokenRequest) {
          return throwError(() => err);
        }

        if ([401, 403].includes(err.status) && this.accountService.accountValue) {
          this.accountService.logout();
        }

        const error =
          err.error?.message ||
          err.error?.title ||
          err.statusText ||
          'Unknown Error';

        this.alertService.error(error);

        return throwError(() => err);
      })
    );
  }
}