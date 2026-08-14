import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {Auth,signInWithEmailAndPassword} from '@angular/fire/auth';
import {ActivatedRoute} from '@angular/router';
import { CompanyApiService } from '../../../../../core/services/company-api.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';

  loading = false;
  errorMessage = '';

  showPassword = false;


  constructor(
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private companyApi: CompanyApiService
  ) {}


  async login(): Promise<void> {

    this.errorMessage = '';

    if (
      !this.email.trim() ||
      !this.password
    ) {
      this.errorMessage =
        'Ingresa tu correo y contraseña.';

      return;
    }


    this.loading = true;


    try {

      await signInWithEmailAndPassword(
        this.auth,
        this.email.trim(),
        this.password
      );


      this.companyApi
        .checkMyCompanyExists()
        .subscribe({

          next: async response => {

            if (response.exists) {

              await this.router.navigate([
                '/dashboard/home'
              ]);

            } else {

              await this.router.navigate([
                '/dashboard/company/setup'
              ]);

            }

          },

          error: async error => {

            console.error(
              'Error verificando empresa:',
              error
            );

            await this.router.navigate([
              '/dashboard/company/setup'
            ]);

          }

        });


    } catch (error: any) {

      console.error(
        'Error iniciando sesión:',
        error
      );


      switch (error?.code) {

        case 'auth/invalid-credential':
          this.errorMessage =
            'Correo o contraseña incorrectos.';
          break;

        case 'auth/invalid-email':
          this.errorMessage =
            'El correo ingresado no es válido.';
          break;

        case 'auth/too-many-requests':
          this.errorMessage =
            'Demasiados intentos. Intenta nuevamente en unos minutos.';
          break;

        default:
          this.errorMessage =
            'No fue posible iniciar sesión.';
      }

    } finally {

      this.loading = false;

    }

  }


  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

  }

  infoMessage = '';

  ngOnInit(): void {

    const reason =
      this.route.snapshot
        .queryParamMap
        .get('reason');


    if (
      reason === 'session-required'
    ) {

      this.infoMessage =
        'Inicia sesión para continuar en WisePick.';

    }

  }

}