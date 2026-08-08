package com.wisepick.company.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CompanyResponse {

    private String id;

    private String name;

    private String industry;

    private String city;

    private String country;

    private String employees;

    private List<String> categories;

    private String dailySalesRange;

    private String salesRecordMethod;

    private List<String> salesChannels;

    private List<String> objectives;

    private String preferredDataSource;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    public CompanyResponse() {
    }


    public CompanyResponse(
            String id,
            String name,
            String industry,
            String city,
            String country,
            String employees,
            List<String> categories,
            String dailySalesRange,
            String salesRecordMethod,
            List<String> salesChannels,
            List<String> objectives,
            String preferredDataSource,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {

        this.id = id;
        this.name = name;
        this.industry = industry;
        this.city = city;
        this.country = country;
        this.employees = employees;
        this.categories = categories;
        this.dailySalesRange = dailySalesRange;
        this.salesRecordMethod = salesRecordMethod;
        this.salesChannels = salesChannels;
        this.objectives = objectives;
        this.preferredDataSource = preferredDataSource;
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


    public List<String> getCategories() {
        return categories;
    }


    public void setCategories(List<String> categories) {
        this.categories = categories;
    }


    public String getDailySalesRange() {
        return dailySalesRange;
    }


    public void setDailySalesRange(String dailySalesRange) {
        this.dailySalesRange = dailySalesRange;
    }


    public String getSalesRecordMethod() {
        return salesRecordMethod;
    }


    public void setSalesRecordMethod(String salesRecordMethod) {
        this.salesRecordMethod = salesRecordMethod;
    }


    public List<String> getSalesChannels() {
        return salesChannels;
    }


    public void setSalesChannels(List<String> salesChannels) {
        this.salesChannels = salesChannels;
    }


    public List<String> getObjectives() {
        return objectives;
    }


    public void setObjectives(List<String> objectives) {
        this.objectives = objectives;
    }


    public String getPreferredDataSource() {
        return preferredDataSource;
    }


    public void setPreferredDataSource(String preferredDataSource) {
        this.preferredDataSource = preferredDataSource;
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
