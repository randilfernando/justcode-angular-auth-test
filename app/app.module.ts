import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {AuthModule} from '@juztcode/angular-auth';
import {AppComponent} from './app.component';
import {TestAuthComponent} from './components/test-auth/test-auth.component';
import {RequestLoggerInterceptor} from './providers/request-logger/request-logger.interceptor';

import {AUTH_CONFIG, AUTH_CONFIG_ADDITIONAL} from './config/auth-package.config';

@NgModule({
  declarations: [
    AppComponent,
    TestAuthComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule.forRoot(AUTH_CONFIG, AUTH_CONFIG_ADDITIONAL)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestLoggerInterceptor,
      multi: true
    }  
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
