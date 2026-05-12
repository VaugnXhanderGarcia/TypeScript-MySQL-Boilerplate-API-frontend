import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { App } from './app';
import { AppRoutingModule } from './app-routing-module';

import { AlertComponent } from './_components/alert.component';

import { AccountService } from './_services';
import {
  appInitializer,
  JwtInterceptor,
  ErrorInterceptor
} from './_helpers';

export function initializeApp(accountService: AccountService) {
  return () => appInitializer(accountService);
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
  ],
  bootstrap: [App]
})
export class AppModule {}