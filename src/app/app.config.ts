import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyDlTYpnyC0t-dFxtJS_zjSLhzmd3os8jUI',
        authDomain: 'wisepick-82116.firebaseapp.com',
        projectId: 'wisepick-82116',
        storageBucket: 'wisepick-82116.appspot.com',   // <- usa appspot.com
        messagingSenderId: '1044803687859',
        appId: '1:1044803687859:web:64bf3b55a029da1e3e67c6',
        // measurementId: 'G-F2HHD1VWCV', // opcional. Déjalo si activaste Analytics
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
