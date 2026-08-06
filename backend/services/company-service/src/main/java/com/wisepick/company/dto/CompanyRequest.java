package com.wisepick.company.dto;

import jakarta.validation.constraints.NotBlank;

public class CompanyRequest {

    @NotBlank(message = "El nombre de la empresa es obligatorio")
    private String name;

    private String industry;
    private String city;
    private String country;
    private String employees;


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
}
