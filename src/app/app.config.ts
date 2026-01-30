import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { routes } from './app.routes';
import {provideFlatpickrDefaults} from 'angularx-flatpickr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // Firebase configuration
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyBId60eRdkauw2yClrJyquLR5RRaPhCbys",

        authDomain: "apel-sainte-anne.firebaseapp.com",

        projectId: "apel-sainte-anne",

        storageBucket: "apel-sainte-anne.firebasestorage.app",

        messagingSenderId: "697275691738",

        appId: "1:697275691738:web:44d7760b613f69f9a46be3",

        measurementId: "G-8YFCXV2651"
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAnalytics(() => getAnalytics()),
    provideFlatpickrDefaults(),

  ]
};
