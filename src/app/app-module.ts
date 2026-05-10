
import { environment } from '../environments/environment';
import { fakeBackendProvider } from './_helpers/fake-backend.interceptor';
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
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ...(environment.useFakeBackend ? [fakeBackendProvider] : [])
],
  bootstrap: [App]
})
export class AppModule {}