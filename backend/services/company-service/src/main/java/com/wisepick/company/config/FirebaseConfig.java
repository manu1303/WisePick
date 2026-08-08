package com.wisepick.company.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

import com.google.firebase.auth.FirebaseAuth;


@Configuration
public class FirebaseConfig {


    @Bean
    public FirebaseApp firebaseApp()
            throws IOException {

        if (!FirebaseApp.getApps().isEmpty()) {

            return FirebaseApp.getInstance();

        }


        GoogleCredentials credentials =
                GoogleCredentials
                        .getApplicationDefault();


        FirebaseOptions options =
                FirebaseOptions
                        .builder()
                        .setCredentials(credentials)
                        .build();


        return FirebaseApp.initializeApp(
                options
        );

    }

    @Bean
    public FirebaseAuth firebaseAuth(
            FirebaseApp firebaseApp
    ) {

        return FirebaseAuth.getInstance(
                firebaseApp
        );

    }

}
