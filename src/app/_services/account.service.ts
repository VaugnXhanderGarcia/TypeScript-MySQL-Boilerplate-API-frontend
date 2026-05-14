  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Router } from '@angular/router';
  import { BehaviorSubject, Observable, of } from 'rxjs';
  import { catchError, map } from 'rxjs/operators';

  import { environment } from '../../environments/environment';
  import { Account } from '../_models';

  const baseUrl = `${environment.apiUrl}/accounts`;

  @Injectable({ providedIn: 'root' })
  export class AccountService {
    private accountSubject: BehaviorSubject<Account | null>;
    public account: Observable<Account | null>;
    private refreshTokenTimeout?: any;

    clearAccount() {
  this.stopRefreshTokenTimer();
  localStorage.removeItem('account');
  this.accountSubject.next(null);
}
    constructor(
    private router: Router,
    private http: HttpClient
  ) {
  const storedAccount = localStorage.getItem('account');
  this.accountSubject = new BehaviorSubject<Account | null>(
    storedAccount ? JSON.parse(storedAccount) : null
  );
  this.account = this.accountSubject.asObservable();
}

public get accountValue(): Account | null {
  return this.accountSubject.value;
}

 login(email: string, password: string) {
  return this.http.post<Account>(
    `${baseUrl}/authenticate`,
    { email, password },
    { withCredentials: true }
  ).pipe(
    map(account => {
      this.accountSubject.next(account);
      localStorage.setItem('account', JSON.stringify(account));
      this.startRefreshTokenTimer();
      return account;
    })
  );
}
   logout() {
    this.http.post<any>(`${baseUrl}/revoke-token`, {}, { withCredentials: true })
        .subscribe({
            next: () => {},
            error: () => {}
        });

    this.stopRefreshTokenTimer();
    this.accountSubject.next(null);
    this.router.navigate(['/account/login']);
}

  refreshToken() {
  return this.http.post<Account>(
    `${baseUrl}/refresh-token`,
    {},
    { withCredentials: true }
  ).pipe(
    map(account => {
      this.accountSubject.next(account);
      localStorage.setItem('account', JSON.stringify(account));
      this.startRefreshTokenTimer();
      return account;
    })
  );
}
    register(account: any) {
      return this.http.post(`${baseUrl}/register`, account);
    }

    verifyEmail(token: string) {
      return this.http.post(`${baseUrl}/verify-email`, { token });
    }

    forgotPassword(email: string) {
      return this.http.post(`${baseUrl}/forgot-password`, { email });
    }

    validateResetToken(token: string) {
      return this.http.post(`${baseUrl}/validate-reset-token`, { token });
    }

    resetPassword(token: string, password: string, confirmPassword: string) {
      return this.http.post(`${baseUrl}/reset-password`, {
        token,
        password,
        confirmPassword
      });
    }

    getAll() {
      return this.http.get<Account[]>(baseUrl, {
        withCredentials: true
      });
    }

    getById(id: string) {
      return this.http.get<Account>(`${baseUrl}/${id}`, {
        withCredentials: true
      });
    }

    create(params: any) {
      return this.http.post(baseUrl, params, {
        withCredentials: true
      });
    }

    update(id: string, params: any) {
      return this.http.put<Account>(`${baseUrl}/${id}`, params, {
        withCredentials: true
      }).pipe(
        map(account => {
          const currentAccount = this.accountValue;

          if (account.id === currentAccount?.id) {
            account = { ...currentAccount, ...account };
            this.accountSubject.next(account);
          }

          return account;
        })
      );
    }

    delete(id: string) {
      return this.http.delete(`${baseUrl}/${id}`, {
        withCredentials: true
      }).pipe(
        map(response => {
          const currentAccount = this.accountValue;

          if (id === currentAccount?.id) {
            this.logout();
          }

          return response;
        })
      );
    }

    private clearSession() {
      this.stopRefreshTokenTimer();
      this.accountSubject.next(null);
      this.router.navigate(['/account/login']);
    }

    private startRefreshTokenTimer() {
      const jwtToken = this.accountValue?.jwtToken;

      if (!jwtToken) {
        return;
      }

      try {
        const jwtTokenParts = jwtToken.split('.');

        if (jwtTokenParts.length !== 3) {
          return;
        }

        const jwtTokenPayload = JSON.parse(atob(jwtTokenParts[1]));
        const expires = new Date(jwtTokenPayload.exp * 1000);

        const timeout = expires.getTime() - Date.now() - 60 * 1000;

        if (timeout > 0) {
          this.refreshTokenTimeout = setTimeout(() => {
            this.refreshToken().subscribe();
          }, timeout);
        }
      } catch (error) {
        console.warn('Unable to start refresh token timer:', error);
      }
    }

    private stopRefreshTokenTimer() {
      if (this.refreshTokenTimeout) {
        clearTimeout(this.refreshTokenTimeout);
      }
    }

   clearAccountOnly() {
  this.stopRefreshTokenTimer();
  this.accountSubject.next(null);
  this.router.navigate(['/account/login']);
}
  }