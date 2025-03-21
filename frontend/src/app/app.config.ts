// app.config.ts
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(IonicModule.forRoot()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
