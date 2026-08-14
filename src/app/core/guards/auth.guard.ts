import { inject } from '@angular/core';
import {CanActivateFn,Router} from '@angular/router';
import {Auth} from '@angular/fire/auth';


export const authGuard: CanActivateFn =
  async () => {

    const auth =
      inject(Auth);

    const router =
      inject(Router);


    try {

      /*
       * Esperamos a que Firebase termine
       * de restaurar o descartar la sesión.
       */

      await auth.authStateReady();


      /*
       * Si existe usuario,
       * permitimos entrar.
       */

      if (auth.currentUser) {

        return true;

      }


      /*
       * Si no hay usuario,
       * Angular redirige al login.
       */

      return router.createUrlTree(
        ['/login'],
      {
        queryParams: {
          reason: 'session-required'
        }
      });


    } catch (error) {

      console.error(
        'Error validando sesión:',
        error
      );


      return router.createUrlTree(
        ['/login'],
        {
          queryParams: {
            reason: 'session-required'
          }
        }
      );

    }

  };