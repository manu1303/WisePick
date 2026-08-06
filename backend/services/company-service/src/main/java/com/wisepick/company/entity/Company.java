package com.wisepick.company.entity;

import java.time.LocalDateTime;

public class Company {

    private String id;
    private String name;
    private String industry;
    private String city;
    private String country;
    private String employees;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    public Company() {
    }


    public Company(
            String id,
            String name,
            String industry,
            String city,
            String country,
            String employees,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.name = name;
        this.industry = industry;
        this.city = city;
        this.country = country;
        this.employees = employees;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


    public String getId() {
        return id;
    }


    public void setId(String id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }


    public String getIndustry() {
        return industry;
    }


    public void setIndustry(String industry) {
        this.industry = industry;
    }


    public String getCity() {
        return city;
    }


    public void setCity(String city) {
        this.city = city;
    }


    public String getCountry() {
        return country;
    }


    public void setCountry(String country) {
        this.country = country;
    }


    public String getEmployees() {
        return employees;
    }


    public void setEmployees(String employees) {
        this.employees = employees;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }


    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}