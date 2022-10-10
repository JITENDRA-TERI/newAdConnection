import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

import { MatMenuModule } from '@angular/material/menu';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

import {
  MsalGuard,
  MsalInterceptor,
  MsalBroadcastService,
  MsalInterceptorConfiguration,
  MsalModule,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalGuardConfiguration,
  MsalRedirectComponent
} from '@azure/msal-angular';
import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation,
  LogLevel
} from '@azure/msal-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

window.navigator.userAgent.indexOf('MSIE ') > -1 ||
window.navigator.userAgent.indexOf('Trident/') > -1;
export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export function MSALInstanceFactory(): IPublicClientApplication {
  console.log('We are getting MSALInstanceFactory instance');
  return new PublicClientApplication({
    auth: {
      //      clientId: 'f4299fca-0b4d-40a9-915b-deca45bc3515', // B2B AD
      clientId: 'c5444c89-abfa-4131-b848-1932a77be62c', // B2C AD
      authority: 'https://login.microsoftonline.com/0b3ab4ca-fd6e-4b4e-97b8-77cc0c8a00d6',
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: '/'
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      //storeAuthStateInCookie: isIE // set to true for IE 11. Remove this line to use Angular Universal
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false
      }
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  console.log('We are getting MSALInterceptorConfigFactory instance');
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', [
    'user.read'
  ]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  console.log('We are getting MSALGuardConfigFactory instance');
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read']
    },
    loginFailedRoute: '/login-failed'
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    HttpClientModule,
    MsalModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService


  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
