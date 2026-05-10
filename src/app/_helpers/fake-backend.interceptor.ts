import { Injectable, Provider } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { Role } from '../_models';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  private accounts: any[] = JSON.parse(localStorage.getItem('fake-accounts') || '[]');

  constructor() {
    if (!this.accounts.length) {
      this.accounts = [
        {
          id: 1,
          title: 'Mr',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@test.com',
          password: '123456',
          role: Role.Admin,
          isVerified: true
        },
        {
          id: 2,
          title: 'Ms',
          firstName: 'Normal',
          lastName: 'User',
          email: 'user@test.com',
          password: '123456',
          role: Role.User,
          isVerified: true
        }
      ];

      localStorage.setItem('fake-accounts', JSON.stringify(this.accounts));
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, body } = request;

    return of(null).pipe(
      mergeMap(() => handleRoute()),
      materialize(),
      delay(500),
      dematerialize()
    );

    function handleRoute() {
      if (url.endsWith('/accounts/authenticate') && method === 'POST') {
        return authenticate();
      }

      if (url.endsWith('/accounts/register') && method === 'POST') {
        return register();
      }

      if (url.endsWith('/accounts/verify-email') && method === 'POST') {
        return verifyEmail();
      }

      if (url.endsWith('/accounts/forgot-password') && method === 'POST') {
        return forgotPassword();
      }

      if (url.endsWith('/accounts/reset-password') && method === 'POST') {
        return resetPassword();
      }

      if (url.endsWith('/accounts') && method === 'GET') {
        return getAccounts();
      }

      return next.handle(request);
    }

    function authenticate() {
      const { email, password } = body;

      const accounts = JSON.parse(localStorage.getItem('fake-accounts') || '[]');

      const account = accounts.find((x: any) =>
        x.email.toLowerCase() === String(email).toLowerCase().trim() &&
        x.password === password
      );

      if (!account) {
        return error('Email or password is incorrect');
      }

      if (!account.isVerified) {
        return error('Account is not verified');
      }

      return ok({
        ...basicDetails(account),
        jwtToken: createFakeJwtToken(account)
      });
    }

    function register() {
      const accounts = JSON.parse(localStorage.getItem('fake-accounts') || '[]');
      const cleanEmail = String(body.email).trim().toLowerCase();

      if (accounts.find((x: any) => x.email.toLowerCase() === cleanEmail)) {
        return error(`Email "${body.email}" is already registered`);
      }

      const isFirstAccount = accounts.length === 0;

      const account = {
        id: accounts.length ? Math.max(...accounts.map((x: any) => x.id)) + 1 : 1,
        title: body.title,
        firstName: body.firstName,
        lastName: body.lastName,
        email: cleanEmail,
        password: body.password,
        role: isFirstAccount ? Role.Admin : Role.User,
        isVerified: true
      };

      accounts.push(account);
      localStorage.setItem('fake-accounts', JSON.stringify(accounts));

      alert('Mock verification email sent. Fake backend automatically verified this account.');

      return ok({
        message: 'Registration successful. Mock verification email sent.'
      });
    }

    function verifyEmail() {
      return ok({
        message: 'Verification successful'
      });
    }

    function forgotPassword() {
      alert('Mock password reset email sent.');

      return ok({
        message: 'Please check your email for password reset instructions'
      });
    }

    function resetPassword() {
      return ok({
        message: 'Password reset successful'
      });
    }

    function getAccounts() {
      const accounts = JSON.parse(localStorage.getItem('fake-accounts') || '[]')
        .map((x: any) => basicDetails(x));

      return ok(accounts);
    }

    function ok(body?: any) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function error(message: string) {
      return throwError(() => ({ error: { message } }));
    }

    function basicDetails(account: any) {
      const { id, title, firstName, lastName, email, role, isVerified } = account;

      return {
        id,
        title,
        firstName,
        lastName,
        email,
        role,
        isVerified
      };
    }

    function createFakeJwtToken(account: any) {
      const header = {
        alg: 'HS256',
        typ: 'JWT'
      };

      const payload = {
        sub: account.id,
        id: account.id,
        email: account.email,
        role: account.role,
        exp: Math.floor(Date.now() / 1000) + 15 * 60
      };

      const encodedHeader = btoa(JSON.stringify(header));
      const encodedPayload = btoa(JSON.stringify(payload));

      return `${encodedHeader}.${encodedPayload}.fake-signature`;
    }
  }
}

export const fakeBackendProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};