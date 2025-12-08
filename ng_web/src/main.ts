import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { appConfig } from './app/app.config';
import { DOCUMENT } from '@angular/common';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    ...appConfig.providers // or appConfig.providers directly if array
  ]
}).catch(err => console.error(err));
