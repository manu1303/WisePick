import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  Auth,
  createUserWithEmailAndPassword,
  updateProfile
} from '@angular/fire/auth';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl:
    './register.component.html',
  styleUrls: [
    './register.component.scss'
  ]
})
export class RegisterComponent {

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  loading = false;
  errorMessage = '';

  showPassword = false;


  constructor(
    private auth: Auth,
    private router: Router
  ) {}


  async register():
    Promise<void> {

    this.errorMessage = '';


    if (
      !this.name.trim() ||
      !this.email.trim() ||
      !this.password ||
      !this.confirmPassword
    ) {

      this.errorMessage =
        'Completa todos los campos.';

      return;

    }


    if (
      this.password.length < 6
    ) {

      this.errorMessage =
        'La contraseña debe tener al menos 6 caracteres.';

      return;

    }


    if (
      this.password !==
      this.confirmPassword
    ) {

      this.errorMessage =
        'Las contraseñas no coinciden.';

      return;

    }


    this.loading = true;


    try {

      const credential =
        await createUserWithEmailAndPassword(
          this.auth,
          this.email.trim(),
          this.password
        );


      await updateProfile(
        credential.user,
        {
          displayName:
            this.name.trim()
        }
      );


      /*
       * Usuario recién creado:
       * primero configuramos empresa.
       */

      await this.router.navigate([
        '/dashboard/company/setup'
      ]);


    } catch (error: any) {

      console.error(
        'Error registrando usuario:',
        error
      );


      switch (error?.code) {

        case 'auth/email-already-in-use':

          this.errorMessage =
            'Ya existe una cuenta con este correo.';

          break;


        case 'auth/invalid-email':

          this.errorMessage =
            'Ingresa un correo válido.';

          break;


        case 'auth/weak-password':

          this.errorMessage =
            'La contraseña es demasiado débil.';

          break;


        default:

          this.errorMessage =
            'No fue posible crear tu cuenta.';

      }

    } finally {

      this.loading = false;

    }

  }


  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

  }

}