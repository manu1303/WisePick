package com.wisepick.marketingai.dto;

import java.math.BigDecimal;

public record ProductDto(

        String id,

        String name,

        String category,

        BigDecimal cost,

        BigDecimal price,

        Integer stock,

        String status

) {}