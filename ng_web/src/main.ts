import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    ...appConfig.providers // or appConfig.providers directly if array
  ]
}).catch(err => console.error(err));
