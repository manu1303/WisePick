package com.wisepick.sales.config;

import com.google.auth.oauth2.GoogleCredentials;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import com.google.firebase.auth.FirebaseAuth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;


@Configuration
public class FirebaseConfig {


    @Bean
    public FirebaseApp firebaseApp()
            throws IOException {


        /*
         * Si Firebase ya fue inicializado
         * dentro de esta aplicación,
         * reutilizamos la instancia.
         */

        if (
                !FirebaseApp
                        .getApps()
                        .isEmpty()
        ) {

            return FirebaseApp
                    .getInstance();

        }


        /*
         * Utilizamos las credenciales
         * configuradas mediante
         * GOOGLE_APPLICATION_CREDENTIALS.
         */

        GoogleCredentials credentials =
                GoogleCredentials
                        .getApplicationDefault();


        FirebaseOptions options =
                FirebaseOptions
                        .builder()
                        .setCredentials(
                                credentials
                        )
                        .build();


        return FirebaseApp
                .initializeApp(
                        options
                );

    }


    @Bean
    public FirebaseAuth firebaseAuth(
            FirebaseApp firebaseApp
    ) {

        return FirebaseAuth
                .getInstance(
                        firebaseApp
                );

    }

}
