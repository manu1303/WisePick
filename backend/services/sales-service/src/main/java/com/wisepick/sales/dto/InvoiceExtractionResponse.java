package com.wisepick.sales.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record InvoiceExtractionResponse(

        String documentType,

        String invoiceNumber,

        LocalDate issueDate,

        InvoiceParty seller,

        InvoiceParty buyer,

        List<InvoiceItem> items,

        BigDecimal subtotal,

        BigDecimal discount,

        BigDecimal tax,

        BigDecimal total,

        String currency,

        BigDecimal confidence,

        List<String> warnings

) {

    public record InvoiceParty(
            String name,
            String taxId
    ) {
    }

    public record InvoiceItem(
            String code,
            String description,
            BigDecimal quantity,
            BigDecimal unitPrice,
            BigDecimal discount,
            BigDecimal subtotal
    ) {
    }
}