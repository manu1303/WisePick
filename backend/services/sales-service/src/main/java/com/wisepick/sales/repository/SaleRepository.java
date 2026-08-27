package com.wisepick.sales.repository;

import com.wisepick.sales.entity.Sale;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface SaleRepository
        extends JpaRepository<Sale, String> {


    List<Sale> findByOwnerUid(
            String ownerUid
    );


    List<Sale>
    findByOwnerUidOrderBySaleDateDesc(
            String ownerUid
    );


    Optional<Sale>
    findByIdAndOwnerUid(
            String id,
            String ownerUid
    );


    List<Sale>
    findByOwnerUidAndSaleDateBetween(
            String ownerUid,
            LocalDate startDate,
            LocalDate endDate
    );

}