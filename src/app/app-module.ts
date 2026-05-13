import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountService } from './_services';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing-module';

import { AlertComponent } from './_components/alert.component';

import {
  appInitializer,
  JwtInterceptor,
  ErrorInterceptor
} from './_helpers';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),

    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AccountService]
    },

    JwtInterceptor,
    ErrorInterceptor
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}