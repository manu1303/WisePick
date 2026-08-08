package com.wisepick.company.config;

import com.wisepick.company.security.FirebaseAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
public class SecurityConfig {


    private final FirebaseAuthenticationFilter
            firebaseAuthenticationFilter;


    public SecurityConfig(
            FirebaseAuthenticationFilter firebaseAuthenticationFilter
    ) {

        this.firebaseAuthenticationFilter =
                firebaseAuthenticationFilter;

    }


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    )
            throws Exception {


        http

                /*
                 * Nuestra API REST no usa
                 * formularios ni sesiones.
                 */

                .csrf(
                        csrf ->
                                csrf.disable()
                )


                /*
                 * Backend stateless.
                 */

                .sessionManagement(
                        session ->
                                session.sessionCreationPolicy(
                                        SessionCreationPolicy.STATELESS
                                )
                )


                /*
                 * Reglas de acceso.
                 */

                .authorizeHttpRequests(
                        auth ->
                                auth

                                        /*
                                         * Health público.
                                         */

                                        .requestMatchers(
                                                HttpMethod.GET,
                                                "/api/company/health"
                                        )
                                        .permitAll()


                                        /*
                                         * Todo Company requiere
                                         * Firebase Auth.
                                         */

                                        .requestMatchers(
                                                "/api/companies/**"
                                        )
                                        .authenticated()


                                        .requestMatchers(
                                                "/api/companies"
                                        )
                                        .authenticated()


                                        .anyRequest()
                                        .permitAll()
                )


                /*
                 * Firebase debe ejecutar
                 * antes del filtro estándar
                 * de autenticación.
                 */

                .addFilterBefore(
                        firebaseAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();

    }

}
