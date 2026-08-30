package com.wisepick.marketingai.dto;

import java.math.BigDecimal;

public record ProductMetricDto(

        String id,

        String name,

        Integer quantity,

        BigDecimal revenue

) {}