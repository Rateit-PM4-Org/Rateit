import {Routes} from '@angular/router';
import {TabMenuComponent} from './features/tabs/tab-menu/tab-menu.component';
import {AuthGuard} from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabMenuComponent,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/tabs/home/home.component').then((m) => m.HomeComponent),
          },
          {
            path: 'rits/view/:ritId',
            loadComponent: () =>
              import('./features/rit/rit-create/rit-create.component').then((m) => m.RitCreateComponent),
            canActivate: [AuthGuard],
            data: {mode: 'view'},
          },
          {
            path: 'rits/ratings/:ritId',
            loadComponent: () =>
              import('./features/rating/all-ratings/all-ratings.component').then((m) => m.AllRatingsComponent),
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'rits',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/tabs/all-rits/all-rits.component').then((m) => m.AllRitsComponent),
            canActivate: [AuthGuard],
          },
          {
            path: 'view/:ritId',
            loadComponent: () =>
              import('./features/rit/rit-create/rit-create.component').then((m) => m.RitCreateComponent),
            canActivate: [AuthGuard],
            data: {mode: 'view'},
          },
          {
            path: 'ratings/:ritId',
            loadComponent: () =>
              import('./features/rating/all-ratings/all-ratings.component').then((m) => m.AllRatingsComponent),
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/tabs/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/tabs/register/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: 'user/mail-confirmation',
        loadComponent: () =>
          import('./features/tabs/mail-confirmation/mail-confirmation.component').then(
            (m) => m.MailConfirmationComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/tabs/profile/profile.component').then((m) => m.ProfileComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'build-info',
        loadComponent: () =>
          import('./features/tabs/app-build-info/app-build-info.component').then(
            (m) => m.AppBuildInfoComponent
          ),
      },
      {
        path: 'scanner',
        loadComponent: () =>
          import('./features/tabs/scannertest/scannertest.component').then(
            (m) => m.ScannertestComponent
          )
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      }
    ],
  },
  {
    path: 'build-info',
    redirectTo: '/tabs/build-info',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
