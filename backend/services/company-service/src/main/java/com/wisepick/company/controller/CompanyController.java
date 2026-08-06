package com.wisepick.company.controller;

import com.wisepick.company.dto.CompanyRequest;
import com.wisepick.company.dto.CompanyResponse;
import com.wisepick.company.service.CompanyService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            CompanyRequest request
    ) {

        CompanyResponse response =
                companyService.create(
                        request
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
}