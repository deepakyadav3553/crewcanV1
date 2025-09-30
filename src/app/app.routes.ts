import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    loadComponent: () => import('./features/auth/components/welcome/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'otp-verification',
    loadComponent: () => import('./features/auth/components/otp-verification/otp-verification.component').then(m => m.OtpVerificationComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/components/profile/profile').then(m => m.Profile)
  },
  {
    path: '**',
    redirectTo: '/welcome'
  }
];
