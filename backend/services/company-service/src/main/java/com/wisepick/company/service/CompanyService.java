package com.wisepick.company.service;

import com.wisepick.company.dto.CompanyRequest;
import com.wisepick.company.dto.CompanyResponse;
import com.wisepick.company.entity.Company;
import com.wisepick.company.exception.CompanyNotFoundException;
import com.wisepick.company.repository.CompanyRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;


@Service
public class CompanyService {

    private static final String LIST_SEPARATOR = "|";

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
            CompanyRequest request,
            String ownerUid
    ) {

        String id =
                UUID.randomUUID()
                        .toString();


        LocalDateTime now =
                LocalDateTime.now();


        Company company =
                new Company(
                        id,
                        ownerUid,
                        request.getName(),
                        request.getIndustry(),
                        request.getCity(),
                        request.getCountry(),
                        request.getEmployees(),
                        listToString(
                                request.getCategories()
                        ),
                        request.getDailySalesRange(),
                        request.getSalesRecordMethod(),
                        listToString(
                                request.getSalesChannels()
                        ),
                        listToString(
                                request.getObjectives()
                        ),
                        request.getPreferredDataSource(),
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
       GET ALL
    ============================ */

    public List<CompanyResponse> getAll() {

        return companyRepository
                .findAll()
                .stream()
                .map(
                        this::toResponse
                )
                .toList();
    }


    /* ============================
       GET BY ID
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


        company.setCategories(
                listToString(
                        request.getCategories()
                )
        );


        company.setDailySalesRange(
                request.getDailySalesRange()
        );


        company.setSalesRecordMethod(
                request.getSalesRecordMethod()
        );


        company.setSalesChannels(
                listToString(
                        request.getSalesChannels()
                )
        );


        company.setObjectives(
                listToString(
                        request.getObjectives()
                )
        );


        company.setPreferredDataSource(
                request.getPreferredDataSource()
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

    public void delete(
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


        companyRepository.delete(
                company
        );
    }


    /* ============================
       ENTITY → RESPONSE
    ============================ */

    private CompanyResponse toResponse(
            Company company
    ) {

        return new CompanyResponse(
                company.getId(),
                company.getOwnerUid(),
                company.getName(),
                company.getIndustry(),
                company.getCity(),
                company.getCountry(),
                company.getEmployees(),
                stringToList(
                        company.getCategories()
                ),
                company.getDailySalesRange(),
                company.getSalesRecordMethod(),
                stringToList(
                        company.getSalesChannels()
                ),
                stringToList(
                        company.getObjectives()
                ),
                company.getPreferredDataSource(),
                company.getCreatedAt(),
                company.getUpdatedAt()
        );
    }


    /* ============================
       LIST → STRING
    ============================ */

    private String listToString(
            List<String> values
    ) {

        if (
                values == null ||
                values.isEmpty()
        ) {

            return "";

        }


        return String.join(
                LIST_SEPARATOR,
                values
        );
    }


    /* ============================
       STRING → LIST
    ============================ */

    private List<String> stringToList(
            String value
    ) {

        if (
                value == null ||
                value.isBlank()
        ) {

            return Collections.emptyList();

        }


        return Arrays.asList(
                value.split("\\|")
        );
    }

    /* ============================
       OWNER UID → COMPANY
    ============================ */
    public CompanyResponse getByOwnerUid(
        String ownerUid
        ) {

        Company company =
                companyRepository
                        .findByOwnerUid(
                                ownerUid
                        )
                        .orElseThrow(
                                () ->
                                        new CompanyNotFoundException(
                                                "Empresa no encontrada para el usuario autenticado"
                                        )
                        );


        return toResponse(
                company
        );

     }

     public boolean existsByOwnerUid(
        String ownerUid
        ) {

        return companyRepository
                .existsByOwnerUid(
                        ownerUid
                );

        }







}
