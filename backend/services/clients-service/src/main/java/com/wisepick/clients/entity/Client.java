package com.wisepick.clients.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(
        name = "clients",
        indexes = {
                @Index(
                        name = "idx_clients_owner_uid",
                        columnList = "owner_uid"
                ),
                @Index(
                        name = "idx_clients_company_id",
                        columnList = "company_id"
                ),
                @Index(
                        name = "idx_clients_email",
                        columnList = "email"
                ),
                @Index(
                        name = "idx_clients_status",
                        columnList = "status"
                )
        }
)
public class Client {


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
    private String phone;


    @Column
    private String email;


    @Column
    private String city;


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

        createdAt = now;

        updatedAt = now;


        if (
                status == null ||
                status.isBlank()
        ) {

            status = "ACTIVE";

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
