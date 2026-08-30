package com.wisepick.marketingai.dto;

import java.math.BigDecimal;

public record SaleDto(

        String id,

        String customerId,

        String customerName,

        String productId,

        String productName,

        Integer quantity,

        BigDecimal unitPrice,

        BigDecimal total,

        String paymentMethod,

        String source

) {}