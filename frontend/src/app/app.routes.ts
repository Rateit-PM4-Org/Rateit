import { Routes } from '@angular/router';
import { TabMenuComponent } from './features/tabs/tab-menu/tab-menu.component';
import { AuthGuard } from './shared/guards/auth.guard';

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
        path: 'rits',
        loadComponent: () => import('./features/tabs/all-rits/all-rits.component').then((m) => m.AllRitsComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'ratings',
        loadComponent: () => import('./features/rating/all-ratings/all-ratings.component').then((m) => m.AllRatingsComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'login',
        loadComponent: () => import('./features/tabs/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./features/tabs/register/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: 'user/mail-confirmation',
        loadComponent: () => import('./features/tabs/mail-confirmation/mail-confirmation.component').then((m) => m.MailConfirmationComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/tabs/profile/profile.component').then((m) => m.ProfileComponent),
        canActivate: [AuthGuard],
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
