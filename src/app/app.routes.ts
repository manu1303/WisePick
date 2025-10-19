import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { 
    path: '', 
    component: LandingComponent, 
    title: 'WisePick | Marketing inteligente para pymes' 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];
