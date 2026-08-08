import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  CompanyApiService
} from '../../../../../core/services/company-api.service';

import {
  Company
} from '../../../../../core/models/company.model';


interface CompanyForm {

  name: string;

  city: string;

  businessType: string;

  categories: string[];

  employeesRange: string;

  dailySalesRange: string;

  salesRecordMethod: string;

  salesChannels: string[];

  objectives: string[];

  preferredDataSource: string;

}


@Component({
  selector: 'app-company-setup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl:
    './company-setup.component.html',
  styleUrls: [
    './company-setup.component.scss'
  ]
})
export class CompanySetupComponent
  implements OnInit {


  currentStep = 1;

  totalSteps = 5;


  saving = false;

  loading = true;

  errorMessage = '';


  companyId:
    string | null = null;


  company: CompanyForm = {

    name: '',

    city: '',

    businessType: '',

    categories: [],

    employeesRange: '',

    dailySalesRange: '',

    salesRecordMethod: '',

    salesChannels: [],

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

    this.loadExistingCompany();

  }


  /* ==========================
     LOAD EXISTING COMPANY
  ========================== */

  private loadExistingCompany(): void {

    const savedCompanyId =
      localStorage.getItem(
        'wisepick_company_id'
      );


    if (!savedCompanyId) {

      this.loading = false;

      return;

    }


    this.companyApi
      .getCompanyById(
        savedCompanyId
      )
      .subscribe({

        next: (
          company
        ) => {

          this.companyId =
            company.id ?? null;


          this.company.name =
            company.name;


          this.company.city =
            company.city;


          this.company.businessType =
            company.industry;


          this.company.employeesRange =
            company.employees;


          this.loading = false;

          this.company.categories =
            company.categories ?? [];

          this.company.dailySalesRange =
            company.dailySalesRange ?? '';

          this.company.salesRecordMethod =
            company.salesRecordMethod ?? '';

          this.company.salesChannels =
            company.salesChannels ?? [];

          this.company.objectives =
            company.objectives ?? [];

          this.company.preferredDataSource =
            company.preferredDataSource ?? '';

        },

        error: (
          error
        ) => {

          console.error(
            'Error cargando empresa:',
            error
          );


          localStorage.removeItem(
            'wisepick_company_id'
          );


          this.companyId =
            null;


          this.loading = false;

        }

      });

  }


  /* ==========================
     STEPS
  ========================== */

  nextStep(): void {

    if (
      this.currentStep <
      this.totalSteps
    ) {

      this.currentStep++;

    }

  }


  previousStep(): void {

    if (
      this.currentStep > 1
    ) {

      this.currentStep--;

    }

  }


  /* ==========================
     SELECTIONS
  ========================== */

  toggleCategory(
    category: string
  ): void {

    const index =
      this.company
        .categories
        .indexOf(
          category
        );


    if (index >= 0) {

      this.company
        .categories
        .splice(
          index,
          1
        );

    } else {

      this.company
        .categories
        .push(
          category
        );

    }

  }


  toggleChannel(
    channel: string
  ): void {

    const index =
      this.company
        .salesChannels
        .indexOf(
          channel
        );


    if (index >= 0) {

      this.company
        .salesChannels
        .splice(
          index,
          1
        );

    } else {

      this.company
        .salesChannels
        .push(
          channel
        );

    }

  }


  toggleObjective(
    objective: string
  ): void {

    const index =
      this.company
        .objectives
        .indexOf(
          objective
        );


    if (index >= 0) {

      this.company
        .objectives
        .splice(
          index,
          1
        );

    } else {

      this.company
        .objectives
        .push(
          objective
        );

    }

  }


  isSelected(
    list: string[],
    value: string
  ): boolean {

    return list.includes(
      value
    );

  }


  /* ==========================
     SAVE
  ========================== */

  finishSetup(): void {

    if (
      !this.company.name.trim()
    ) {

      this.errorMessage =
        'Ingresa el nombre de la empresa.';

      return;

    }


    this.saving = true;

    this.errorMessage = '';


    /*
     * Mapeamos el formulario
     * actual al modelo que
     * entiende company-service.
     */

    const request: Company = {

      name:
        this.company.name,

      city:
        this.company.city,

      industry:
        this.company.businessType,

      country:
        'Ecuador',

      employees:
        this.company.employeesRange,

      categories:
        this.company.categories,

      dailySalesRange:
        this.company.dailySalesRange,

      salesRecordMethod:
        this.company.salesRecordMethod,

      salesChannels:
        this.company.salesChannels,

      objectives:
        this.company.objectives,

      preferredDataSource:
        this.company.preferredDataSource

    };


    /*
     * Si existe un ID:
     * UPDATE.
     *
     * Si no:
     * CREATE.
     */

    if (
      this.companyId
    ) {

      this.updateCompany(
        request
      );

    } else {

      this.createCompany(
        request
      );

    }

  }


  /* ==========================
     CREATE
  ========================== */

  private createCompany(
    request: Company
  ): void {

    this.companyApi
      .createCompany(
        request
      )
      .subscribe({

        next: (
          company
        ) => {

          if (
            company.id
          ) {

            localStorage.setItem(
              'wisepick_company_id',
              company.id
            );

          }


          this.saving = false;


          this.router.navigate([
            '/dashboard/company'
          ]);

        },

        error: (
          error
        ) => {

          console.error(
            'Error creando empresa:',
            error
          );


          this.errorMessage =
            'No fue posible guardar la empresa.';


          this.saving = false;

        }

      });

  }


  /* ==========================
     UPDATE
  ========================== */

  private updateCompany(
    request: Company
  ): void {

    if (
      !this.companyId
    ) {

      return;

    }


    this.companyApi
      .updateCompany(
        this.companyId,
        request
      )
      .subscribe({

        next: () => {

          this.saving = false;


          this.router.navigate([
            '/dashboard/company'
          ]);

        },

        error: (
          error
        ) => {

          console.error(
            'Error actualizando empresa:',
            error
          );


          this.errorMessage =
            'No fue posible actualizar la empresa.';


          this.saving = false;

        }

      });

  }

}