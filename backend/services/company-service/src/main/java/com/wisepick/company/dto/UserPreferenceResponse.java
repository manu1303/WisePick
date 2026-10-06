package com.wisepick.company.dto;

public class UserPreferenceResponse {

    private String language;
    private String currency;
    private String theme;

    private NotificationSettings notifications;

    public static class NotificationSettings {

        private boolean lowStock;
        private boolean campaigns;
        private boolean insights;
        private boolean reports;

        public boolean isLowStock() { return lowStock; }
        public void setLowStock(boolean lowStock) {
            this.lowStock = lowStock;
        }

        public boolean isCampaigns() { return campaigns; }
        public void setCampaigns(boolean campaigns) {
            this.campaigns = campaigns;
        }

        public boolean isInsights() { return insights; }
        public void setInsights(boolean insights) {
            this.insights = insights;
        }

        public boolean isReports() { return reports; }
        public void setReports(boolean reports) {
            this.reports = reports;
        }
    }

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

    public NotificationSettings getNotifications() {
        return notifications;
    }

    public void setNotifications(NotificationSettings notifications) {
        this.notifications = notifications;
    }
}