package com.wisepick.campaigns.controller;

import com.wisepick.campaigns.dto.CampaignRequest;
import com.wisepick.campaigns.dto.CampaignResponse;
import com.wisepick.campaigns.service.CampaignService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {


    private final CampaignService campaignService;


    public CampaignController(
            CampaignService campaignService
    ) {

        this.campaignService =
                campaignService;

    }


    @GetMapping("/health")
    public ResponseEntity<String> health() {

        return ResponseEntity.ok(
                "campaign-service OK"
        );

    }


    @GetMapping
    public ResponseEntity<List<CampaignResponse>> getAll(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                campaignService.getAll(
                        authentication.getName()
                )
        );

    }


    @GetMapping("/active")
    public ResponseEntity<List<CampaignResponse>> getActive(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                campaignService.getActive(
                        authentication.getName()
                )
        );

    }


    @GetMapping("/source/{source}")
    public ResponseEntity<List<CampaignResponse>> getBySource(
            @PathVariable String source,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                campaignService.getBySource(
                        authentication.getName(),
                        source
                )
        );

    }


    @GetMapping("/{id}")
    public ResponseEntity<CampaignResponse> getById(
            @PathVariable String id,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                campaignService.getById(
                        id,
                        authentication.getName()
                )
        );

    }


    @PostMapping
    public ResponseEntity<CampaignResponse> create(
            @Valid
            @RequestBody
            CampaignRequest request,
            Authentication authentication
    ) {

        CampaignResponse response =
                campaignService.create(
                        request,
                        authentication.getName()
                );


        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(
                        response
                );

    }


    @PutMapping("/{id}")
    public ResponseEntity<CampaignResponse> update(
            @PathVariable String id,
            @Valid
            @RequestBody
            CampaignRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                campaignService.update(
                        id,
                        request,
                        authentication.getName()
                )
        );

    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id,
            Authentication authentication
    ) {

        campaignService.delete(
                id,
                authentication.getName()
        );


        return ResponseEntity
                .noContent()
                .build();

    }

}
