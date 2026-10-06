package com.wisepick.company.dto;

import jakarta.validation.constraints.NotBlank;

public class UserPreferenceRequest {

    @NotBlank
    private String language;

    @NotBlank
    private String currency;

    @NotBlank
    private String theme;

    private boolean notifyLowStock;
    private boolean notifyCampaigns;
    private boolean notifyInsights;
    private boolean notifyReports;

    // GETTERS / SETTERS

    public String getLanguage() { return language; }
    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getTheme() { return theme; }
    public void setTheme(String theme) {
        this.theme = theme;
    }

    public boolean isNotifyLowStock() {
        return notifyLowStock;
    }

    public void setNotifyLowStock(boolean notifyLowStock) {
        this.notifyLowStock = notifyLowStock;
    }

    public boolean isNotifyCampaigns() {
        return notifyCampaigns;
    }

    public void setNotifyCampaigns(boolean notifyCampaigns) {
        this.notifyCampaigns = notifyCampaigns;
    }

    public boolean isNotifyInsights() {
        return notifyInsights;
    }

    public void setNotifyInsights(boolean notifyInsights) {
        this.notifyInsights = notifyInsights;
    }

    public boolean isNotifyReports() {
        return notifyReports;
    }

    public void setNotifyReports(boolean notifyReports) {
        this.notifyReports = notifyReports;
    }
}