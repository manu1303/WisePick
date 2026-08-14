package com.wisepick.company.controller;

import com.wisepick.company.dto.CompanyRequest;
import com.wisepick.company.dto.CompanyResponse;
import com.wisepick.company.service.CompanyService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.core.Authentication;
import java.util.Map;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;


    public CompanyController(
            CompanyService companyService
    ) {
        this.companyService =
                companyService;
    }


    @PostMapping
        public ResponseEntity<CompanyResponse> create(
                @Valid
                @RequestBody
                CompanyRequest request,

                Authentication authentication
        ) {

        String ownerUid =
                authentication.getName();


        CompanyResponse response =
                companyService.create(
                        request,
                        ownerUid
                );


        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(
                        response
                );

        }


    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> getById(
            @PathVariable
            String id
    ) {

        return ResponseEntity.ok(
                companyService.getById(
                        id
                )
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<CompanyResponse> update(
            @PathVariable
            String id,

            @Valid
            @RequestBody
            CompanyRequest request
    ) {

        return ResponseEntity.ok(
                companyService.update(
                        id,
                        request
                )
        );
    }

    @GetMapping
        public ResponseEntity<List<CompanyResponse>> getAll() {

        return ResponseEntity.ok(
            companyService.getAll()
        );
        }

    @DeleteMapping("/{id}")
        public ResponseEntity<Void> delete(
        @PathVariable
        String id
    ) {

        companyService.delete(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
        public ResponseEntity<CompanyResponse> getMyCompany(
                Authentication authentication
        ) {

        String ownerUid =
                authentication.getName();


        return ResponseEntity.ok(
                companyService
                        .getByOwnerUid(
                                ownerUid
                        )
        );

        }


        @GetMapping("/me/exists")
        public ResponseEntity<Map<String, Boolean>>
                existsMyCompany(
                        Authentication authentication
                ) {

        String ownerUid =
                authentication.getName();


        boolean exists =
                companyService
                        .existsByOwnerUid(
                                ownerUid
                        );


        return ResponseEntity.ok(
                Map.of(
                        "exists",
                        exists
                )
        );

        }







}