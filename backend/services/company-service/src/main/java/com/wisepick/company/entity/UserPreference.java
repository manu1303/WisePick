package com.wisepick.company.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_preferences")
public class UserPreference {

    @Id
    private String id;

    @Column(name = "owner_uid", unique = true, nullable = false)
    private String ownerUid;

    @Column(nullable = false)
    private String language = "es";

    @Column(nullable = false)
    private String currency = "USD";

    @Column(nullable = false)
    private String theme = "system";

    @Column(name = "notify_low_stock")
    private boolean notifyLowStock = true;

    @Column(name = "notify_campaigns")
    private boolean notifyCampaigns = true;

    @Column(name = "notify_insights")
    private boolean notifyInsights = true;

    @Column(name = "notify_reports")
    private boolean notifyReports = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public UserPreference() {}

    // -------- GETTERS / SETTERS --------

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOwnerUid() { return ownerUid; }
    public void setOwnerUid(String ownerUid) { this.ownerUid = ownerUid; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public boolean isNotifyLowStock() { return notifyLowStock; }
    public void setNotifyLowStock(boolean notifyLowStock) {
        this.notifyLowStock = notifyLowStock;
    }

    public boolean isNotifyCampaigns() { return notifyCampaigns; }
    public void setNotifyCampaigns(boolean notifyCampaigns) {
        this.notifyCampaigns = notifyCampaigns;
    }

    public boolean isNotifyInsights() { return notifyInsights; }
    public void setNotifyInsights(boolean notifyInsights) {
        this.notifyInsights = notifyInsights;
    }

    public boolean isNotifyReports() { return notifyReports; }
    public void setNotifyReports(boolean notifyReports) {
        this.notifyReports = notifyReports;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}