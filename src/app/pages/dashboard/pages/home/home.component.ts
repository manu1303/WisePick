import {Component,OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute,Router} from '@angular/router';
import {CompanyApiService} from '../../../../core/services/company-api.service';


type HomeState =
  | 'DEMO'
  | 'NEW_USER'
  | 'COMPANY_CONFIGURED'
  | 'ACTIVE';


@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    CommonModule
  ],
  templateUrl:
    './home.component.html',
  styleUrls: [
    './home.component.scss'
  ]
})
export class HomeComponent
  implements OnInit {


  homeState:
    HomeState = 'NEW_USER';


  loading = true;

  isDemoMode = false;


  constructor(

    private router:
      Router,

    private route:
      ActivatedRoute,

    private companyApi:
      CompanyApiService

  ) {}


  ngOnInit(): void {

    this.isDemoMode =
      this.router.url
        .startsWith('/demo');


    if (
      this.isDemoMode
    ) {

      this.homeState =
        'DEMO';

      this.loading =
        false;

      return;

    }


    this.loadHomeState();

  }


  private loadHomeState(): void {

    this.companyApi
      .checkMyCompanyExists()
      .subscribe({

        next: response => {

          if (
            response.exists
          ) {

            this.homeState =
              'COMPANY_CONFIGURED';

          } else {

            this.homeState =
              'NEW_USER';

          }


          this.loading =
            false;

        },


        error: error => {

          console.error(
            'Error verificando empresa:',
            error
          );


          this.homeState =
            'NEW_USER';


          this.loading =
            false;

        }

      });

  }


  startCompanySetup(): void {

    if (
      this.isDemoMode
    ) {

      this.router.navigate([
        '/demo/company/setup'
      ]);

      return;

    }


    this.router.navigate([
      '/dashboard/company/setup'
    ]);

  }


  addFirstData(): void {

    if (
      this.isDemoMode
    ) {

      this.router.navigate([
        '/demo/sales/import'
      ]);

      return;

    }


    this.router.navigate([
      '/dashboard/sales/import'
    ]);

  }


  startDemo(): void {

    this.router.navigate([
      '/demo/company/setup'
    ]);

  }

}

