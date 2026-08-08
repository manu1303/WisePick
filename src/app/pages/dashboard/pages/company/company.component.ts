import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  CompanyApiService
} from '../../../../core/services/company-api.service';

import {
  Company
} from '../../../../core/models/company.model';


interface CompanyProfile {

  id?: string;

  name: string;

  city: string;

  employeesRange: string;

  businessType: string;

  categories: string[];

  dailySalesRange: string;

  salesRecordMethod: string;

  objectives: string[];

  preferredDataSource: string;

}


@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './company.component.html',
  styleUrls: [
    './company.component.scss'
  ]
})
export class CompanyComponent
  implements OnInit {


  loading = true;

  errorMessage = '';


  company: CompanyProfile = {

    name: '',

    city: '',

    employeesRange: '',

    businessType: '',

    categories: [],

    dailySalesRange: '',

    salesRecordMethod: '',

    objectives: [],

    preferredDataSource: ''

  };


  constructor(

    private router:
      Router,

    private companyApi:
      CompanyApiService

  ) {}


  ngOnInit(): void {

    this.loadCompany();

  }


  /* ==========================
     LOAD COMPANY
  ========================== */

  private loadCompany(): void {

    const savedCompanyId =
      localStorage.getItem(
        'wisepick_company_id'
      );


    /*
     * Si ya conocemos el ID,
     * buscamos directamente
     * esa empresa.
     */

    if (savedCompanyId) {

      this.companyApi
        .getCompanyById(
          savedCompanyId
        )
        .subscribe({

          next: (
            company
          ) => {

            this.setCompany(
              company
            );

          },

          error: () => {

            /*
             * Si el ID guardado
             * ya no existe,
             * buscamos las empresas
             * disponibles.
             */

            localStorage.removeItem(
              'wisepick_company_id'
            );

            this.loadFirstCompany();

          }

        });

      return;

    }


    /*
     * Mientras todavía no tenemos
     * autenticación asociada a empresa,
     * recuperamos la primera empresa.
     */

    this.loadFirstCompany();

  }


  private loadFirstCompany(): void {

    this.companyApi
      .getCompanies()
      .subscribe({

        next: (
          companies
        ) => {

          if (
            companies.length === 0
          ) {

            this.loading = false;

            return;

          }


          const company =
            companies[0];


          if (company.id) {

            localStorage.setItem(
              'wisepick_company_id',
              company.id
            );

          }


          this.setCompany(
            company
          );

        },

        error: (
          error
        ) => {

          console.error(
            'Error cargando empresa:',
            error
          );

          this.errorMessage =
            'No fue posible cargar la empresa.';

          this.loading = false;

        }

      });

  }


  /* ==========================
     MAP BACKEND → UI
  ========================== */

  private setCompany(
    company: Company
  ): void {

    this.company = {

      id:
        company.id,

      name:
        company.name,

      city:
        company.city,

      employeesRange:
        company.employees,

      businessType:
        company.industry,

      categories:
        company.categories ?? [],

      dailySalesRange:
        company.dailySalesRange ?? '',

      salesRecordMethod:
        company.salesRecordMethod ?? '',

      objectives:
        company.objectives ?? [],

      preferredDataSource:
        company.preferredDataSource ?? ''

    };


    this.loading = false;

  }


  /* ==========================
     ACTIONS
  ========================== */

  editCompany(): void {

    this.router.navigate([
      '/dashboard/company/setup'
    ]);

  }


  addData(): void {

    this.router.navigate([
      '/dashboard/sales/import'
    ]);

  }

}