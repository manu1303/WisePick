package com.wisepick.campaigns.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(
        name = "campaigns",
        indexes = {
                @Index(
                        name = "idx_campaigns_owner_uid",
                        columnList = "owner_uid"
                ),
                @Index(
                        name = "idx_campaigns_company_id",
                        columnList = "company_id"
                ),
                @Index(
                        name = "idx_campaigns_status",
                        columnList = "status"
                ),
                @Index(
                        name = "idx_campaigns_source",
                        columnList = "source"
                )
        }
)
public class Campaign {


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
    private String objective;


    @Column
    private String audience;


    @Column
    private String channel;

    @Column(columnDefinition = "TEXT")
    private String message;


    @Column(name = "target_type")
    private String targetType;


    @Column(name = "target_id")
    private String targetId;


    @Column(name = "target_name")
    private String targetName;


    @Column(
            nullable = false
    )
    private String source;


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
                source == null ||
                source.isBlank()
        ) {

            source = "MANUAL";

        }


        if (
                status == null ||
                status.isBlank()
        ) {

            status = "DRAFT";

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
