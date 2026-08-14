package com.wisepick.company.repository;

import com.wisepick.company.entity.Company;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository
        extends JpaRepository<Company, String> {

    Optional<Company> findByOwnerUid(
            String ownerUid
    );

    boolean existsByOwnerUid(String ownerUid);

}
