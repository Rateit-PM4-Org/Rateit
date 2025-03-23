import { Routes } from '@angular/router';
import { TabMenuComponent } from './features/tabs/tab-menu/tab-menu.component';

export const routes: Routes = [
    {
        path: '',
        component: TabMenuComponent,
        children: [
          {
            path: 'home',
            loadComponent: () => import('./features/tabs/home/home.component').then((m) => m.HomeComponent),
          },
          {
            path: 'profile',
            loadComponent: () => import('./features/tabs/profile/profile.component').then((m) => m.ProfileComponent),
          },
          {
            path: '',
            redirectTo: '/home',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
];
