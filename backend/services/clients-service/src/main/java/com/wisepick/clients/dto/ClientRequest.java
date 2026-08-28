package com.wisepick.clients.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;


public class ClientRequest {


    @NotBlank
    private String companyId;


    @NotBlank
    private String name;


    private String phone;


    @Email
    private String email;


    private String city;


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

}
