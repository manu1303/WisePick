package com.wisepick.company.service;

import com.wisepick.company.dto.CompanyRequest;
import com.wisepick.company.dto.CompanyResponse;
import com.wisepick.company.entity.Company;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CompanyService {

    private final Map<String, Company> companies =
            new ConcurrentHashMap<>();


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


        companies.put(
                id,
                company
        );


        return toResponse(
                company
        );
    }


    public CompanyResponse getById(
            String id
    ) {

        Company company =
                companies.get(id);


        if (company == null) {

            throw new RuntimeException(
                    "Empresa no encontrada"
            );

        }


        return toResponse(
                company
        );
    }


    public CompanyResponse update(
            String id,
            CompanyRequest request
    ) {

        Company company =
                companies.get(id);


        if (company == null) {

            throw new RuntimeException(
                    "Empresa no encontrada"
            );

        }


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


        companies.put(
                id,
                company
        );


        return toResponse(
                company
        );
    }


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
