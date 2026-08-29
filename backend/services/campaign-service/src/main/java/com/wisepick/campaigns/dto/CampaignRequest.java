package com.wisepick.campaigns.dto;

import jakarta.validation.constraints.NotBlank;


public class CampaignRequest {


    @NotBlank
    private String companyId;


    @NotBlank
    private String name;


    private String objective;


    private String audience;


    private String channel;

    private String message;

    private String targetType;

    private String targetId;

    private String targetName;


    private String source;


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


    public String getObjective() {
        return objective;
    }

    public void setObjective(
            String objective
    ) {
        this.objective = objective;
    }


    public String getAudience() {
        return audience;
    }

    public void setAudience(
            String audience
    ) {
        this.audience = audience;
    }


    public String getChannel() {
        return channel;
    }

    public void setChannel(
            String channel
    ) {
        this.channel = channel;
    }

    public String getMessage() {
    return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTargetType() {
        return targetType;
    }

    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }

    public String getTargetId() {
        return targetId;
    }

    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    public String getTargetName() {
        return targetName;
    }

    public void setTargetName(String targetName) {
        this.targetName = targetName;
    }


    public String getSource() {
        return source;
    }

    public void setSource(
            String source
    ) {
        this.source = source;
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
