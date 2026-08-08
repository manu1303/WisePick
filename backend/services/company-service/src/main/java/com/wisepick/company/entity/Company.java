package com.wisepick.company.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    private String id;

    @Column(name = "owner_uid")
    private String ownerUid;

    @Column(nullable = false)
    private String name;

    private String industry;

    private String city;

    private String country;

    private String employees;

    @Column(columnDefinition = "text")
    private String categories;

    @Column(name = "daily_sales_range")
    private String dailySalesRange;

    @Column(name = "sales_record_method")
    private String salesRecordMethod;

    @Column(name = "sales_channels", columnDefinition = "text")
    private String salesChannels;

    @Column(columnDefinition = "text")
    private String objectives;

    @Column(name = "preferred_data_source")
    private String preferredDataSource;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    public Company() {
    }


    public Company(
            String id,
            String ownerUid,
            String name,
            String industry,
            String city,
            String country,
            String employees,
            String categories,
            String dailySalesRange,
            String salesRecordMethod,
            String salesChannels,
            String objectives,
            String preferredDataSource,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {

        this.id = id;
        this.ownerUid = ownerUid;
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

    public String getOwnerUid() {
        return ownerUid;
    }

    public void setOwnerUid(String ownerUid) {
        this.ownerUid = ownerUid;
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


    public String getCategories() {
        return categories;
    }


    public void setCategories(String categories) {
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


    public String getSalesChannels() {
        return salesChannels;
    }


    public void setSalesChannels(String salesChannels) {
        this.salesChannels = salesChannels;
    }


    public String getObjectives() {
        return objectives;
    }


    public void setObjectives(String objectives) {
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