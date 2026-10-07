package com.wisepick.sales.service;

import com.wisepick.sales.dto.InvoiceExtractionResponse;
import org.springframework.web.multipart.MultipartFile;

public interface AiProvider {

    InvoiceExtractionResponse extractInvoice(
            MultipartFile file
    );
}