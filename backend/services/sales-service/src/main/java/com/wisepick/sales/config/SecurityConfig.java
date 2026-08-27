package com.wisepick.sales.config;

import com.wisepick.sales.security.FirebaseAuthenticationFilter;

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
                 * ==========================
                 * CORS
                 * ==========================
                 */

                .cors(
                        cors ->
                                cors.configurationSource(
                                        corsConfigurationSource()
                                )
                )


                /*
                 * API REST.
                 */

                .csrf(
                        csrf ->
                                csrf.disable()
                )


                /*
                 * No utilizamos sesiones
                 * del servidor.
                 */

                .sessionManagement(
                        session ->
                                session.sessionCreationPolicy(
                                        SessionCreationPolicy.STATELESS
                                )
                )


                /*
                 * ==========================
                 * ACCESS RULES
                 * ==========================
                 */

                .authorizeHttpRequests(
                        auth ->
                                auth


                                        /*
                                         * Health público.
                                         */

                                        .requestMatchers(
                                                HttpMethod.GET,
                                                "/api/sales/health"
                                        )
                                        .permitAll()


                                        /*
                                         * Necesario para
                                         * preflight CORS.
                                         */

                                        .requestMatchers(
                                                HttpMethod.OPTIONS,
                                                "/**"
                                        )
                                        .permitAll()


                                        /*
                                         * Sales protegido.
                                         */

                                        .requestMatchers(
                                                "/api/sales/**"
                                        )
                                        .authenticated()


                                        /*
                                         * Resto permitido.
                                         */

                                        .anyRequest()
                                        .permitAll()
                )


                /*
                 * Firebase se ejecuta antes
                 * del filtro estándar.
                 */

                .addFilterBefore(
                        firebaseAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();

    }


    /*
     * ============================
     * CORS
     * ============================
     */

    @Bean
    public CorsConfigurationSource
            corsConfigurationSource() {


        CorsConfiguration configuration =
                new CorsConfiguration();


        /*
         * Angular local.
         */

        configuration
                .setAllowedOrigins(
                        List.of(
                                "http://localhost:4200"
                        )
                );


        configuration
                .setAllowedMethods(
                        List.of(
                                "GET",
                                "POST",
                                "PUT",
                                "DELETE",
                                "OPTIONS"
                        )
                );


        /*
         * Incluye Authorization.
         */

        configuration
                .setAllowedHeaders(
                        List.of("*")
                );


        configuration
                .setAllowCredentials(
                        true
                );


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
                "/api/**",
                configuration
        );


        return source;

    }

}
