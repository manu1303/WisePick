package com.wisepick.sales.dto;

public record InvoiceAnalysisResponse(

        InvoiceExtractionResponse extraction,

        InvoiceValidationResult validation

) {
}