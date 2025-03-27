import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { addIcons } from 'ionicons';
import { addOutline, close, home, personOutline, pricetagOutline, star } from 'ionicons/icons';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Call the element loader before the bootstrapModule/bootstrapApplication call
defineCustomElements(window);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(),
    provideIonicAngular({ mode: 'ios' }),
    provideRouter(routes),
  ],
});

addIcons({
  home,
  personOutline,
  addOutline,
  pricetagOutline,
  star,
  close
});
