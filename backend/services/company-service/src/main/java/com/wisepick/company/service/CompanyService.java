package com.wisepick.company.service;

import com.wisepick.company.dto.CompanyRequest;
import com.wisepick.company.dto.CompanyResponse;
import com.wisepick.company.entity.Company;
import com.wisepick.company.exception.CompanyNotFoundException;
import com.wisepick.company.repository.CompanyRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

import java.util.List;

import com.wisepick.company.exception.CompanyNotFoundException;


@Service
public class CompanyService {

    private final CompanyRepository companyRepository;


    public CompanyService(
            CompanyRepository companyRepository
    ) {
        this.companyRepository =
                companyRepository;
    }


    /* ============================
       CREATE
    ============================ */

    public CompanyResponse create(
            CompanyRequest request
    ) {

        String id =
                UUID.randomUUID().toString();


        LocalDateTime now =
                LocalDateTime.now();


        Company company =
                new Company(
                        id,
                        request.getName(),
                        request.getIndustry(),
                        request.getCity(),
                        request.getCountry(),
                        request.getEmployees(),
                        now,
                        now
                );


        Company savedCompany =
                companyRepository.save(
                        company
                );


        return toResponse(
                savedCompany
        );
    }


    /* ============================
       GET
    ============================ */

    public CompanyResponse getById(
            String id
    ) {

        Company company =
        companyRepository
                .findById(id)
                .orElseThrow(
                        () ->
                                new CompanyNotFoundException(
                                        "Empresa no encontrada"
                                )
                );


        return toResponse(
                company
        );
    }


    /* ============================
       UPDATE
    ============================ */

    public CompanyResponse update(
            String id,
            CompanyRequest request
    ) {

        Company company =
        companyRepository
                .findById(id)
                .orElseThrow(
                        () ->
                                new CompanyNotFoundException(
                                        "Empresa no encontrada"
                                )
                
                        );


        company.setName(
                request.getName()
        );

        company.setIndustry(
                request.getIndustry()
        );

        company.setCity(
                request.getCity()
        );

        company.setCountry(
                request.getCountry()
        );

        company.setEmployees(
                request.getEmployees()
        );

        company.setUpdatedAt(
                LocalDateTime.now()
        );


        Company updatedCompany =
                companyRepository.save(
                        company
                );


        return toResponse(
                updatedCompany
        );




    }

    /* ============================
       DELETE
    ============================ */

    public void delete(String id) {

    Company company =
            companyRepository
                    .findById(id)
                    .orElseThrow(
                            () ->
                                    new CompanyNotFoundException(
                                            "Empresa no encontrada"
                                    )
                    );

    companyRepository.delete(company);
        }




    public List<CompanyResponse> getAll() {

    return companyRepository
            .findAll()
            .stream()
            .map(this::toResponse)
            .toList();
        }




    
    /* ============================
       MAPPER
    ============================ */

    private CompanyResponse toResponse(
            Company company
    ) {

        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getIndustry(),
                company.getCity(),
                company.getCountry(),
                company.getEmployees(),
                company.getCreatedAt(),
                company.getUpdatedAt()
        );

    }
}
