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

import { AccountService } from '../_services/account.service';
import { AlertService } from '../_services/alert.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Unknown Error';

        if (error.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        if ([401, 403].includes(error.status) && this.accountService.accountValue) {
          this.accountService.logout();
        }

        this.alertService.error(errorMessage);
        return throwError(() => errorMessage);
      })
    );
  }
}