package com.wisepick.sales.dto;

import java.util.List;

public record InvoiceValidationResult(

        boolean valid,

        List<String> errors,

        List<String> warnings

) {
}