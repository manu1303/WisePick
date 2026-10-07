package com.wisepick.sales.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Locale;
import java.util.Set;

@Service
public class InvoiceAnalysisService {

    private static final long MAX_FILE_SIZE =
            8L * 1024L * 1024L;

    private static final Set<String> ALLOWED_CONTENT_TYPES =
            Set.of(
                    "application/pdf",
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/webp"
            );

    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of(
                    "pdf",
                    "jpg",
                    "jpeg",
                    "png",
                    "webp"
            );

    public void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Debes seleccionar un archivo para analizar."
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "El archivo no puede superar los 8 MB."
            );
        }

        String contentType = file.getContentType();
        String extension = getExtension(file.getOriginalFilename());

        boolean validContentType =
                contentType != null &&
                ALLOWED_CONTENT_TYPES.contains(
                        contentType.toLowerCase(Locale.ROOT)
                );

        boolean validExtension =
                extension != null &&
                ALLOWED_EXTENSIONS.contains(extension);

        if (!validContentType && !validExtension) {
            throw new IllegalArgumentException(
                    "Formato no permitido. Usa PDF, JPG, JPEG, PNG o WEBP."
            );
        }
    }

    private String getExtension(String fileName) {

        if (fileName == null || fileName.isBlank()) {
            return null;
        }

        int lastDot = fileName.lastIndexOf('.');

        if (lastDot < 0 || lastDot == fileName.length() - 1) {
            return null;
        }

        return fileName
                .substring(lastDot + 1)
                .toLowerCase(Locale.ROOT);
    }
}