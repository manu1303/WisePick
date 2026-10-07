package com.wisepick.sales.controller;


import com.wisepick.sales.service.InvoiceAnalysisService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.wisepick.sales.service.OpenAiProvider;

import com.wisepick.sales.dto.InvoiceAnalysisResponse;
import com.wisepick.sales.dto.InvoiceExtractionResponse;
import com.wisepick.sales.dto.InvoiceValidationResult;
import com.wisepick.sales.service.InvoiceValidator;

@RestController
@RequestMapping("/api/sales/invoice")
public class InvoiceController {

    private final InvoiceAnalysisService invoiceAnalysisService;
    private final OpenAiProvider openAiProvider;
    private final InvoiceValidator invoiceValidator;

    public InvoiceController(
        InvoiceAnalysisService invoiceAnalysisService,
        OpenAiProvider openAiProvider,
        InvoiceValidator invoiceValidator
        ) {
        this.invoiceAnalysisService = invoiceAnalysisService;
        this.openAiProvider = openAiProvider;
        this.invoiceValidator = invoiceValidator;
        }


        

    @PostMapping(
        value = "/analyze",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
        )
        public ResponseEntity<InvoiceAnalysisResponse> analyzeInvoice(
                @RequestParam("file") MultipartFile file
        ) {

        invoiceAnalysisService.validateFile(file);

        InvoiceExtractionResponse extraction =
                openAiProvider.extractInvoice(file);

        InvoiceValidationResult validation =
                invoiceValidator.validate(extraction);

        InvoiceAnalysisResponse response =
                new InvoiceAnalysisResponse(
                        extraction,
                        validation
                );

        return ResponseEntity.ok(response);
        }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(
            IllegalArgumentException exception
    ) {
        return ResponseEntity
                .badRequest()
                .body(exception.getMessage());
    }
}