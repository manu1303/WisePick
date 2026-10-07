package com.wisepick.sales.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wisepick.sales.dto.InvoiceExtractionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class OpenAiProvider implements AiProvider {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String model;

    public OpenAiProvider(
            RestClient.Builder restClientBuilder,
            ObjectMapper objectMapper,
            @Value("${openai.api-key}") String apiKey,
            @Value("${openai.base-url}") String baseUrl,
            @Value("${openai.model}") String model
    ) {
        this.restClient = restClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader(
                        "Authorization",
                        "Bearer " + apiKey
                )
                .build();

        this.objectMapper = objectMapper;
        this.model = model;
    }

    @Override
        public InvoiceExtractionResponse extractInvoice(
                MultipartFile file
        ) {

        try {
                String contentType = resolveContentType(file);

                String base64 = java.util.Base64
                        .getEncoder()
                        .encodeToString(file.getBytes());

                Map<String, Object> textContent = Map.of(
                        "type", "input_text",
                        "text",
                        """
                        Extrae la información comercial visible del documento.

                        Reglas:
                        - No inventes información.
                        - Si un dato no aparece o no puede determinarse,
                        devuelve null.
                        - issueDate debe usar formato YYYY-MM-DD.
                        - Los valores monetarios deben ser números,
                        sin símbolos de moneda.
                        - quantity representa la cantidad vendida.
                        - unitPrice representa el precio unitario.
                        - subtotal de cada item representa
                        quantity * unitPrice - discount.
                        - Usa USD como currency solamente si la moneda
                        puede identificarse razonablemente como dólares.
                        - confidence debe estar entre 0 y 1.
                        - Agrega en warnings cualquier dato dudoso,
                        ilegible o inconsistente.
                        """
                );

                Map<String, Object> documentContent =
                        buildDocumentContent(
                                file,
                                contentType,
                                base64
                        );

                Map<String, Object> message = Map.of(
                        "role", "user",
                        "content", java.util.List.of(
                                textContent,
                                documentContent
                        )
                );

                Map<String, Object> requestBody = Map.of(
                        "model", model,
                        "input", java.util.List.of(message),
                        "text", Map.of(
                                "format", buildInvoiceFormat()
                        )
                );

                JsonNode response = restClient
                        .post()
                        .uri("/v1/responses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(requestBody)
                        .retrieve()
                        .body(JsonNode.class);

                String outputText =
                        extractOutputText(response);

                return objectMapper.readValue(
                        outputText,
                        InvoiceExtractionResponse.class
                );

        } catch (java.io.IOException exception) {

                throw new IllegalStateException(
                        "No se pudo procesar el documento con IA.",
                        exception
                );
        }
        }


    private String extractOutputText(JsonNode response) {

        if (response == null) {
            throw new IllegalStateException(
                    "OpenAI devolvió una respuesta vacía."
            );
        }

        JsonNode output = response.path("output");

        for (JsonNode item : output) {

            JsonNode content = item.path("content");

            for (JsonNode contentItem : content) {

                if ("output_text".equals(
                        contentItem.path("type").asText()
                )) {
                    return contentItem
                            .path("text")
                            .asText();
                }
            }
        }

        throw new IllegalStateException(
                "No se encontró texto en la respuesta de OpenAI."
        );
    }

    private String detectImageContentType(String fileName) {

        if (fileName == null) {
                return null;
        }

        String lowerName =
                fileName.toLowerCase(java.util.Locale.ROOT);

        if (lowerName.endsWith(".jpg") ||
                lowerName.endsWith(".jpeg")) {
                return "image/jpeg";
        }

        if (lowerName.endsWith(".png")) {
                return "image/png";
        }

        if (lowerName.endsWith(".webp")) {
                return "image/webp";
        }

        return null;
        }

     private Map<String, Object> buildInvoiceFormat() {

        Map<String, Object> nullableString =
                Map.of(
                        "type",
                        java.util.List.of("string", "null")
                );

        Map<String, Object> nullableNumber =
                Map.of(
                        "type",
                        java.util.List.of("number", "null")
                );

        Map<String, Object> partySchema =
                Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "name", nullableString,
                                "taxId", nullableString
                        ),
                        "required", java.util.List.of(
                                "name",
                                "taxId"
                        ),
                        "additionalProperties", false
                );

        Map<String, Object> itemSchema =
                Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "code", nullableString,
                                "description", nullableString,
                                "quantity", nullableNumber,
                                "unitPrice", nullableNumber,
                                "discount", nullableNumber,
                                "subtotal", nullableNumber
                        ),
                        "required", java.util.List.of(
                                "code",
                                "description",
                                "quantity",
                                "unitPrice",
                                "discount",
                                "subtotal"
                        ),
                        "additionalProperties", false
                );

        Map<String, Object> schema =
                Map.of(
                        "type", "object",

                        "properties", Map.ofEntries(

                                Map.entry(
                                        "documentType",
                                        nullableString
                                ),

                                Map.entry(
                                        "invoiceNumber",
                                        nullableString
                                ),

                                Map.entry(
                                        "issueDate",
                                        Map.of(
                                                "type",
                                                java.util.List.of(
                                                        "string",
                                                        "null"
                                                )
                                        )
                                ),

                                Map.entry(
                                        "seller",
                                        Map.of(
                                                "anyOf",
                                                java.util.List.of(
                                                        partySchema,
                                                        Map.of(
                                                                "type",
                                                                "null"
                                                        )
                                                )
                                        )
                                ),

                                Map.entry(
                                        "buyer",
                                        Map.of(
                                                "anyOf",
                                                java.util.List.of(
                                                        partySchema,
                                                        Map.of(
                                                                "type",
                                                                "null"
                                                        )
                                                )
                                        )
                                ),

                                Map.entry(
                                        "items",
                                        Map.of(
                                                "type", "array",
                                                "items", itemSchema
                                        )
                                ),

                                Map.entry(
                                        "subtotal",
                                        nullableNumber
                                ),

                                Map.entry(
                                        "discount",
                                        nullableNumber
                                ),

                                Map.entry(
                                        "tax",
                                        nullableNumber
                                ),

                                Map.entry(
                                        "total",
                                        nullableNumber
                                ),

                                Map.entry(
                                        "currency",
                                        nullableString
                                ),

                                Map.entry(
                                        "confidence",
                                        nullableNumber
                                ),

                                Map.entry(
                                        "warnings",
                                        Map.of(
                                                "type", "array",
                                                "items", Map.of(
                                                        "type",
                                                        "string"
                                                )
                                        )
                                )
                        ),

                        "required", java.util.List.of(
                                "documentType",
                                "invoiceNumber",
                                "issueDate",
                                "seller",
                                "buyer",
                                "items",
                                "subtotal",
                                "discount",
                                "tax",
                                "total",
                                "currency",
                                "confidence",
                                "warnings"
                        ),

                        "additionalProperties", false
                );

        return Map.of(
                "type", "json_schema",
                "name", "invoice_extraction",
                "strict", true,
                "schema", schema
        );
        } 
        
        private String resolveContentType(
        MultipartFile file
) {

    String contentType = file.getContentType();

        if (contentType != null &&
                !"application/octet-stream"
                        .equalsIgnoreCase(contentType)) {

                return contentType.toLowerCase(
                        java.util.Locale.ROOT
                );
        }

        String fileName = file.getOriginalFilename();

        if (fileName == null) {
                throw new IllegalArgumentException(
                        "No se pudo determinar el tipo del archivo."
                );
        }

        String lowerName =
                fileName.toLowerCase(java.util.Locale.ROOT);

        if (lowerName.endsWith(".pdf")) {
                return "application/pdf";
        }

        String imageContentType =
                detectImageContentType(fileName);

        if (imageContentType != null) {
                return imageContentType;
        }

        throw new IllegalArgumentException(
                "No se pudo determinar el tipo del archivo."
        );
        }


        private Map<String, Object> buildDocumentContent(
                MultipartFile file,
                String contentType,
                String base64
        ) {

        if ("application/pdf".equals(contentType)) {

                String fileData =
                        "data:application/pdf;base64," + base64;

                String fileName =
                        file.getOriginalFilename() != null
                                ? file.getOriginalFilename()
                                : "document.pdf";

                return Map.of(
                        "type", "input_file",
                        "filename", fileName,
                        "file_data", fileData
                );
        }

        if (contentType.startsWith("image/")) {

                String dataUrl =
                        "data:" +
                                contentType +
                                ";base64," +
                                base64;

                return Map.of(
                        "type", "input_image",
                        "image_url", dataUrl,
                        "detail", "high"
                );
        }

        throw new IllegalArgumentException(
                "Formato no compatible con el análisis IA."
        );
        }



}