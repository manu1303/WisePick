package com.wisepick.clients.config;

import com.google.auth.oauth2.GoogleCredentials;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

import java.io.FileInputStream;
import java.io.IOException;


@Configuration
public class FirebaseConfig {


    @PostConstruct
    public void initialize()
            throws IOException {


        if (
                !FirebaseApp.getApps().isEmpty()
        ) {

            return;

        }


        String credentialsPath =
                System.getenv(
                        "GOOGLE_APPLICATION_CREDENTIALS"
                );


        if (
                credentialsPath == null ||
                credentialsPath.isBlank()
        ) {

            throw new IllegalStateException(
                    "La variable GOOGLE_APPLICATION_CREDENTIALS no está configurada."
            );

        }


        GoogleCredentials credentials =
                GoogleCredentials.fromStream(
                        new FileInputStream(
                                credentialsPath
                        )
                );


        FirebaseOptions options =
                FirebaseOptions
                        .builder()
                        .setCredentials(
                                credentials
                        )
                        .build();


        FirebaseApp.initializeApp(
                options
        );

    }

}
