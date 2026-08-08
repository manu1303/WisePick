package com.wisepick.company.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class CompanyRequest {

    @NotBlank(message = "El nombre de la empresa es obligatorio")

  

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


    public CompanyRequest() {
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
}
