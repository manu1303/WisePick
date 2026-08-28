package com.wisepick.products.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;


@Component
public class FirebaseAuthenticationFilter
        extends OncePerRequestFilter {


    private final FirebaseAuth
            firebaseAuth;


    public FirebaseAuthenticationFilter(
            FirebaseAuth firebaseAuth
    ) {

        this.firebaseAuth =
                firebaseAuth;

    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    )
            throws ServletException,
            IOException {


        String authorizationHeader =
                request.getHeader(
                        "Authorization"
                );


        if (
                authorizationHeader == null ||
                !authorizationHeader
                        .startsWith(
                                "Bearer "
                        )
        ) {


            filterChain.doFilter(
                    request,
                    response
            );


            return;

        }


        String idToken =
                authorizationHeader
                        .substring(
                                7
                        );


        try {


            FirebaseToken decodedToken =
                    firebaseAuth
                            .verifyIdToken(
                                    idToken
                            );


            String uid =
                    decodedToken
                            .getUid();


            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            uid,
                            null,
                            Collections.emptyList()
                    );


            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );


        } catch (
                Exception exception
        ) {


            SecurityContextHolder
                    .clearContext();

        }


        filterChain.doFilter(
                request,
                response
        );

    }

}
