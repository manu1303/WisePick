package com.wisepick.products.repository;

import com.wisepick.products.entity.Product;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface ProductRepository
        extends JpaRepository<Product, String> {


    List<Product>
    findByOwnerUidOrderByCreatedAtDesc(
            String ownerUid
    );


    Optional<Product>
    findByIdAndOwnerUid(
            String id,
            String ownerUid
    );


    List<Product>
    findByOwnerUidAndStatusOrderByNameAsc(
            String ownerUid,
            String status
    );


    Optional<Product>
    findByOwnerUidAndSku(
            String ownerUid,
            String sku
    );

}
