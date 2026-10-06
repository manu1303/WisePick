package com.wisepick.company.service;

import com.wisepick.company.dto.UserPreferenceRequest;
import com.wisepick.company.dto.UserPreferenceResponse;
import com.wisepick.company.entity.UserPreference;
import com.wisepick.company.repository.UserPreferenceRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;


@Service
public class UserPreferenceService {

    private final UserPreferenceRepository
            userPreferenceRepository;


    public UserPreferenceService(
            UserPreferenceRepository userPreferenceRepository
    ) {

        this.userPreferenceRepository =
                userPreferenceRepository;

    }


    /* ============================
       GET MY PREFERENCES
    ============================ */

    public UserPreferenceResponse getByOwnerUid(
            String ownerUid
    ) {

        UserPreference preference =
                userPreferenceRepository
                        .findByOwnerUid(
                                ownerUid
                        )
                        .orElseGet(
                                () ->
                                        createDefaultPreference(
                                                ownerUid
                                        )
                        );


        return toResponse(
                preference
        );

    }


    /* ============================
       UPDATE MY PREFERENCES
    ============================ */

    public UserPreferenceResponse update(
            String ownerUid,
            UserPreferenceRequest request
    ) {

        UserPreference preference =
                userPreferenceRepository
                        .findByOwnerUid(
                                ownerUid
                        )
                        .orElseGet(
                                () ->
                                        createDefaultPreference(
                                                ownerUid
                                        )
                        );


        preference.setLanguage(
                request.getLanguage()
        );


        preference.setCurrency(
                request.getCurrency()
        );


        preference.setTheme(
                request.getTheme()
        );


        preference.setNotifyLowStock(
                request.isNotifyLowStock()
        );


        preference.setNotifyCampaigns(
                request.isNotifyCampaigns()
        );


        preference.setNotifyInsights(
                request.isNotifyInsights()
        );


        preference.setNotifyReports(
                request.isNotifyReports()
        );


        preference.setUpdatedAt(
                LocalDateTime.now()
        );


        UserPreference savedPreference =
                userPreferenceRepository.save(
                        preference
                );


        return toResponse(
                savedPreference
        );

    }


    /* ============================
       CREATE DEFAULT
    ============================ */

    private UserPreference createDefaultPreference(
            String ownerUid
    ) {

        LocalDateTime now =
                LocalDateTime.now();


        UserPreference preference =
                new UserPreference();


        preference.setId(
                UUID.randomUUID()
                        .toString()
        );


        preference.setOwnerUid(
                ownerUid
        );


        preference.setLanguage(
                "es"
        );


        preference.setCurrency(
                "USD"
        );


        preference.setTheme(
                "system"
        );


        preference.setNotifyLowStock(
                true
        );


        preference.setNotifyCampaigns(
                true
        );


        preference.setNotifyInsights(
                true
        );


        preference.setNotifyReports(
                false
        );


        preference.setCreatedAt(
                now
        );


        preference.setUpdatedAt(
                now
        );


        return userPreferenceRepository.save(
                preference
        );

    }


    /* ============================
       ENTITY → RESPONSE
    ============================ */

    private UserPreferenceResponse toResponse(
            UserPreference preference
    ) {

        UserPreferenceResponse response =
                new UserPreferenceResponse();


        response.setLanguage(
                preference.getLanguage()
        );


        response.setCurrency(
                preference.getCurrency()
        );


        response.setTheme(
                preference.getTheme()
        );


        UserPreferenceResponse.NotificationSettings
                notifications =
                new UserPreferenceResponse
                        .NotificationSettings();


        notifications.setLowStock(
                preference.isNotifyLowStock()
        );


        notifications.setCampaigns(
                preference.isNotifyCampaigns()
        );


        notifications.setInsights(
                preference.isNotifyInsights()
        );


        notifications.setReports(
                preference.isNotifyReports()
        );


        response.setNotifications(
                notifications
        );


        return response;

    }

}