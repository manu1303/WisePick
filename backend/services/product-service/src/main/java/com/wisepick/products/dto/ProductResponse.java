package com.wisepick.products.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;


public class ProductResponse {


    private String id;

    private String companyId;

    private String name;

    private String category;

    private String sku;

    private BigDecimal cost;

    private BigDecimal price;

    private Integer stock;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    public String getId() {
        return id;
    }


    public void setId(
            String id
    ) {
        this.id = id;
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
