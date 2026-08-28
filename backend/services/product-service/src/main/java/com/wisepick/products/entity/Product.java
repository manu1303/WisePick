package com.wisepick.products.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity
@Table(
        name = "products",
        indexes = {
                @Index(
                        name = "idx_products_owner_uid",
                        columnList = "owner_uid"
                ),
                @Index(
                        name = "idx_products_company_id",
                        columnList = "company_id"
                ),
                @Index(
                        name = "idx_products_sku",
                        columnList = "sku"
                ),
                @Index(
                        name = "idx_products_status",
                        columnList = "status"
                )
        }
)
public class Product {


    @Id
    @GeneratedValue(
            strategy = GenerationType.UUID
    )
    private String id;


    @Column(
            name = "owner_uid",
            nullable = false
    )
    private String ownerUid;


    @Column(
            name = "company_id",
            nullable = false
    )
    private String companyId;


    @Column(
            nullable = false
    )
    private String name;


    @Column
    private String category;


    @Column
    private String sku;


    @Column(
            precision = 12,
            scale = 2
    )
    private BigDecimal cost;


    @Column(
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal price;


    @Column(
            nullable = false
    )
    private Integer stock;


    @Column(
            nullable = false
    )
    private String status;


    @Column(
            name = "created_at",
            nullable = false
    )
    private LocalDateTime createdAt;


    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;


    @PrePersist
    public void prePersist() {

        LocalDateTime now =
                LocalDateTime.now();

        createdAt =
                now;

        updatedAt =
                now;

        if (
                status == null ||
                status.isBlank()
        ) {

            status =
                    "ACTIVE";

        }

        if (
                stock == null
        ) {

            stock =
                    0;

        }

    }


    @PreUpdate
    public void preUpdate() {

        updatedAt =
                LocalDateTime.now();

    }


    public String getId() {
        return id;
    }


    public void setId(
            String id
    ) {
        this.id = id;
    }


    public String getOwnerUid() {
        return ownerUid;
    }


    public void setOwnerUid(
            String ownerUid
    ) {
        this.ownerUid = ownerUid;
    }


    public String getCompanyId() {
        return companyId;
    }


    public void setCompanyId(
            String companyId
    ) {
        this.companyId = companyId;
    }


    public String getName() {
        return name;
    }


    public void setName(
            String name
    ) {
        this.name = name;
    }


    public String getCategory() {
        return category;
    }


    public void setCategory(
            String category
    ) {
        this.category = category;
    }


    public String getSku() {
        return sku;
    }


    public void setSku(
            String sku
    ) {
        this.sku = sku;
    }


    public BigDecimal getCost() {
        return cost;
    }


    public void setCost(
            BigDecimal cost
    ) {
        this.cost = cost;
    }


    public BigDecimal getPrice() {
        return price;
    }


    public void setPrice(
            BigDecimal price
    ) {
        this.price = price;
    }


    public Integer getStock() {
        return stock;
    }


    public void setStock(
            Integer stock
    ) {
        this.stock = stock;
    }


    public String getStatus() {
        return status;
    }


    public void setStatus(
            String status
    ) {
        this.status = status;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }


    public void setUpdatedAt(
            LocalDateTime updatedAt
    ) {
        this.updatedAt = updatedAt;
    }

}