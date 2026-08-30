package com.wisepick.marketingai.dto;

public record InsightDto(

        String id,

        String type,

        String priority,

        String icon,

        String title,

        String description,

        String evidence,

        String action,

        String targetType,

        String targetId,

        String targetName

) {}