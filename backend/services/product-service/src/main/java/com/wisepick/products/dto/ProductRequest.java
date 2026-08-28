package com.wisepick.products.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;


public class ProductRequest {


    @NotBlank
    private String companyId;


    @NotBlank
    private String name;


    private String category;


    private String sku;


    @DecimalMin("0.00")
    private BigDecimal cost;


    @NotNull
    @DecimalMin("0.01")
    private BigDecimal price;


    @NotNull
    @Min(0)
    private Integer stock;


    private String status;


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

}