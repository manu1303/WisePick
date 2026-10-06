package com.wisepick.company.controller;

import com.wisepick.company.dto.UserPreferenceRequest;
import com.wisepick.company.dto.UserPreferenceResponse;
import com.wisepick.company.service.UserPreferenceService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/preferences")
public class UserPreferenceController {

    private final UserPreferenceService
            userPreferenceService;


    public UserPreferenceController(
            UserPreferenceService userPreferenceService
    ) {

        this.userPreferenceService =
                userPreferenceService;

    }


    /* ============================
       GET MY PREFERENCES
    ============================ */

    @GetMapping("/me")
    public ResponseEntity<UserPreferenceResponse>
            getMyPreferences(
                    Authentication authentication
            ) {

        String ownerUid =
                authentication.getName();


        return ResponseEntity.ok(
                userPreferenceService
                        .getByOwnerUid(
                                ownerUid
                        )
        );

    }


    /* ============================
       UPDATE MY PREFERENCES
    ============================ */

    @PutMapping("/me")
    public ResponseEntity<UserPreferenceResponse>
            updateMyPreferences(

                    @Valid
                    @RequestBody
                    UserPreferenceRequest request,

                    Authentication authentication
            ) {

        String ownerUid =
                authentication.getName();


        return ResponseEntity.ok(
                userPreferenceService
                        .update(
                                ownerUid,
                                request
                        )
        );

    }

}