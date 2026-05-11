import { environment } from '../environments/environment';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule
} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import {
  appInitializer,
  JwtInterceptor,
  ErrorInterceptor
} from './_helpers';

import { AccountService } from './_services';
import { AlertComponent } from './_components/alert.component';

// Import fake backend only if you still have this file.
// If you do not use fake backend, leave this commented.
// import { fakeBackendProvider } from './_helpers/fake-backend.interceptor';

export function initializeApp(accountService: AccountService) {
  return () => accountService.refreshToken().subscribe().add(() => {});
}

@NgModule({
  declarations: [
    App,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AccountService],
      multi: true
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }

    // Enable only for fake backend testing:
    // ...(environment.useFakeBackend ? [fakeBackendProvider] : [])
  ],
  bootstrap: [App]
})
export class AppModule {}