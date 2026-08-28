package com.wisepick.clients.dto;

import java.time.LocalDateTime;


public class ClientResponse {


    private String id;

    private String companyId;

    private String name;

    private String phone;

    private String email;

    private String city;

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


    public String getPhone() {
        return phone;
    }

    public void setPhone(
            String phone
    ) {
        this.phone = phone;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email
    ) {
        this.email = email;
    }


    public String getCity() {
        return city;
    }

    public void setCity(
            String city
    ) {
        this.city = city;
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