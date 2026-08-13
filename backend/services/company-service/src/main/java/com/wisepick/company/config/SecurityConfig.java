package com.wisepick.company.config;

import com.wisepick.company.security.FirebaseAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


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
                 * CORS
                 *
                 * Permite que Angular
                 * localhost:4200
                 * consuma esta API.
                 */

                .cors(
                        cors ->
                                cors.configurationSource(
                                        corsConfigurationSource()
                                )
                )


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
                                         * Las peticiones OPTIONS
                                         * son necesarias para
                                         * el preflight CORS.
                                         */

                                        .requestMatchers(
                                                HttpMethod.OPTIONS,
                                                "/**"
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


    /*
     * ============================
     * CORS CONFIGURATION
     * ============================
     */

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        /*
         * Frontend Angular
         */

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:4200"
                )
        );


        /*
         * Métodos HTTP permitidos
         */

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );


        /*
         * Headers permitidos.
         *
         * Esto incluye Authorization
         * con el token de Firebase.
         */

        configuration.setAllowedHeaders(
                List.of("*")
        );


        /*
         * Permitimos credenciales
         * desde el frontend.
         */

        configuration.setAllowCredentials(
                true
        );


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        /*
         * Aplicamos CORS a toda
         * nuestra API.
         */

        source.registerCorsConfiguration(
                "/api/**",
                configuration
        );


        return source;

    }

}
