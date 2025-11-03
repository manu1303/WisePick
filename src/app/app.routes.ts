import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  // Landing por defecto
  { path: '', component: LandingComponent, title: 'WisePick | Marketing inteligente para pymes' },

  // Área de trabajo con subrutas
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },    // default interno
      { path: 'home',      loadComponent: () => import('./pages/dashboard/pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'projects',  loadComponent: () => import('./pages/dashboard/pages/projects/projects.component').then(m => m.ProjectsComponent) },
      { path: 'dash',      loadComponent: () => import('./pages/dashboard/pages/dash/dash.component').then(m => m.DashComponent) },
      { path: 'analytics', loadComponent: () => import('./pages/dashboard/pages/analytics/analytics.component').then(m => m.AnalyticsComponent) },
      { path: 'inventory', loadComponent: () => import('./pages/dashboard/pages/inventory/inventory.component').then(m => m.InventoryComponent) },
      { path: 'clients',   loadComponent: () => import('./pages/dashboard/pages/clients/clients.component').then(m => m.ClientsComponent) },
      { path: 'docs',      loadComponent: () => import('./pages/dashboard/pages/docs/docs.component').then(m => m.DocsComponent) },
      { path: 'support',   loadComponent: () => import('./pages/dashboard/pages/support/support.component').then(m => m.SupportComponent) },
    ],
  },

  // Fallback
  { path: '**', redirectTo: '' },
];


