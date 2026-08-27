import { Routes } from '@angular/router';
import {LandingComponent} from './pages/landing/landing.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {LoginComponent} from './pages/dashboard/pages/auth/login/login.component';
import {RegisterComponent} from './pages/dashboard/pages/auth/register/register.component';
import {authGuard} from './core/guards/auth.guard';


export const routes: Routes = [

  /* ==========================
     LANDING
  ========================== */

  {
    path: '',
    component: LandingComponent,
    title: 'WisePick | Marketing inteligente para pymes'
  },


  /* ==========================
     AUTH
  ========================== */

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },


  /* ==========================
     DEMO
     SIN AUTENTICACIÓN
  ========================== */

  {
    path: 'demo',

    component: DashboardComponent,

    data: {
      mode: 'demo'
    },

    children: [

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },

      {
        path: 'home',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/home/home.component'
          ).then(
            m => m.HomeComponent
          )
      },

      {
        path: 'company',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/company/company.component'
          ).then(
            m => m.CompanyComponent
          )
      },

      {
        path: 'company/setup',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/company/setup/company-setup.component'
          ).then(
            m => m.CompanySetupComponent
          )
      },

      {
        path: 'dash',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/dash/dash.component'
          ).then(
            m => m.DashComponent
          )
      },

      {
        path: 'sales',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/sales/sales.component'
          ).then(
            m => m.SalesComponent
          )
      },

      {
        path: 'sales/import',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/sales/import/sales-import.component'
          ).then(
            m => m.SalesImportComponent
          )
      },

      {
        path: 'sales/manual',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/sales/manual/sales-manual.component'
          ).then(
            m => m.SalesManualComponent
          )
      },

      {
        path: 'sales/excel',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/sales/excel/sales-excel.component'
          ).then(
            m => m.SalesExcelComponent
          )
      },

      {
        path: 'sales/invoice',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/sales/invoice/sales-invoice.component'
          ).then(
            m => m.SalesInvoiceComponent
          )
      },

      {
        path: 'products',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/products/products.component'
          ).then(
            m => m.ProductsComponent
          )
      },

      {
        path: 'clients',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/clients/clients.component'
          ).then(
            m => m.ClientsComponent
          )
      },

      {
        path: 'reports',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/reports/reports.component'
          ).then(
            m => m.ReportsComponent
          )
      },

      {
        path: 'settings',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/settings/settings.component'
          ).then(
            m => m.SettingsComponent
          )
      },

      {
        path: 'marketing-ia',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/marketing-ai/marketing-ai.component'
          ).then(
            m => m.MarketingAiComponent
          )
      },

      {
        path: 'campaigns',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/campaigns/campaigns.component'
          ).then(
            m => m.CampaignsComponent
          )
      }

    ]
  },


  /* ==========================
     SISTEMA REAL
     FIREBASE AUTH
  ========================== */

  {
    path: 'dashboard',

    component: DashboardComponent,

    canActivate: [
      authGuard
    ],

    data: {
      mode: 'real'
    },

    children: [

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },

      {
        path: 'home',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/home/home.component'
          ).then(
            m => m.HomeComponent
          )
      },

      {
        path: 'company',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/company/company.component'
          ).then(
            m => m.CompanyComponent
          )
      },

      {
        path: 'company/setup',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/company/setup/company-setup.component'
          ).then(
            m => m.CompanySetupComponent
          )
      },

      {
        path: 'dash',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/dash/dash.component'
          ).then(
            m => m.DashComponent
          )
      },

      {
        path: 'sales',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/sales/sales.component'
          ).then(
            m => m.SalesComponent
          )
      },

      {
        path: 'sales/import',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/sales/import/sales-import.component'
          ).then(
            m => m.SalesImportComponent
          )
      },

      {
        path: 'sales/manual',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/sales/manual/sales-manual.component'
          ).then(
            m => m.SalesManualComponent
          )
      },

      {
        path: 'sales/edit/:id',
        loadComponent: () =>
          import('./pages/dashboard/pages/sales/manual/sales-manual.component')
            .then(m => m.SalesManualComponent)
      },

      {
        path: 'sales/excel',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/sales/excel/sales-excel.component'
          ).then(
            m => m.SalesExcelComponent
          )
      },

      {
        path: 'sales/invoice',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/sales/invoice/sales-invoice.component'
          ).then(
            m => m.SalesInvoiceComponent
          )
      },

      {
        path: 'products',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/products/products.component'
          ).then(
            m => m.ProductsComponent
          )
      },

      {
        path: 'clients',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/clients/clients.component'
          ).then(
            m => m.ClientsComponent
          )
      },

      {
        path: 'reports',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/reports/reports.component'
          ).then(
            m => m.ReportsComponent
          )
      },

      {
        path: 'settings',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/settings/settings.component'
          ).then(
            m => m.SettingsComponent
          )
      },

      {
        path: 'marketing-ia',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/marketing-ai/marketing-ai.component'
          ).then(
            m => m.MarketingAiComponent
          )
      },

      {
        path: 'campaigns',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/campaigns/campaigns.component'
          ).then(
            m => m.CampaignsComponent
          )
      }

    ]
  },


  /* ==========================
     FALLBACK
  ========================== */

  {
    path: '**',
    redirectTo: ''
  }

];


