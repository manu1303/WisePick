package com.wisepick.marketingai.dto;

import java.math.BigDecimal;

public record MarketingSummaryDto(

        BigDecimal totalRevenue,

        Integer totalSales,

        Integer identifiedSales,

        Double identifiedPercentage,

        Integer recurringCustomers,

        Integer lowStockProducts

) {}