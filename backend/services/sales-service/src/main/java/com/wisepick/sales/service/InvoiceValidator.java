package com.wisepick.sales.service;

import com.wisepick.sales.dto.InvoiceExtractionResponse;
import com.wisepick.sales.dto.InvoiceValidationResult;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class InvoiceValidator {

    private static final BigDecimal MONEY_TOLERANCE =
            new BigDecimal("0.02");

    public InvoiceValidationResult validate(
            InvoiceExtractionResponse invoice
    ) {

        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        if (invoice == null) {
            errors.add("No se pudo obtener información del documento.");

            return new InvoiceValidationResult(
                    false,
                    errors,
                    warnings
            );
        }

        validateDate(invoice, warnings);
        validateCustomer(invoice, warnings);
        validateItems(invoice, errors, warnings);
        validateTotals(invoice, warnings);

        return new InvoiceValidationResult(
                errors.isEmpty(),
                errors,
                warnings
        );
    }

    private void validateDate(
            InvoiceExtractionResponse invoice,
            List<String> warnings
    ) {

        if (invoice.issueDate() == null) {
            warnings.add(
                    "No se pudo identificar la fecha de la venta."
            );
            return;
        }

        if (invoice.issueDate().isAfter(LocalDate.now())) {
            warnings.add(
                    "La fecha identificada es posterior a la fecha actual."
            );
        }
    }

    private void validateCustomer(
            InvoiceExtractionResponse invoice,
            List<String> warnings
    ) {

        if (invoice.buyer() == null ||
                isBlank(invoice.buyer().name())) {

            warnings.add(
                    "No se pudo identificar el cliente."
            );
        }
    }

    private void validateItems(
            InvoiceExtractionResponse invoice,
            List<String> errors,
            List<String> warnings
    ) {

        if (invoice.items() == null ||
                invoice.items().isEmpty()) {

            errors.add(
                    "No se identificaron productos en el documento."
            );
            return;
        }

        for (int i = 0; i < invoice.items().size(); i++) {

            InvoiceExtractionResponse.InvoiceItem item =
                    invoice.items().get(i);

            int itemNumber = i + 1;

            if (item == null) {
                errors.add(
                        "El producto " + itemNumber +
                                " no contiene información válida."
                );
                continue;
            }

            if (isBlank(item.description())) {
                warnings.add(
                        "El producto " + itemNumber +
                                " no tiene descripción."
                );
            }

            if (item.quantity() == null) {
                warnings.add(
                        "No se pudo identificar la cantidad del producto " +
                                itemNumber + "."
                );
            } else if (item.quantity()
                    .compareTo(BigDecimal.ZERO) <= 0) {

                errors.add(
                        "La cantidad del producto " +
                                itemNumber +
                                " debe ser mayor que cero."
                );
            }

            if (item.unitPrice() == null) {
                warnings.add(
                        "No se pudo identificar el precio del producto " +
                                itemNumber + "."
                );
            } else if (item.unitPrice()
                    .compareTo(BigDecimal.ZERO) < 0) {

                errors.add(
                        "El precio del producto " +
                                itemNumber +
                                " no puede ser negativo."
                );
            }

            validateItemSubtotal(
                    item,
                    itemNumber,
                    warnings
            );
        }
    }

    private void validateItemSubtotal(
            InvoiceExtractionResponse.InvoiceItem item,
            int itemNumber,
            List<String> warnings
    ) {

        if (item.quantity() == null ||
                item.unitPrice() == null ||
                item.subtotal() == null) {
            return;
        }

        BigDecimal discount =
                item.discount() != null
                        ? item.discount()
                        : BigDecimal.ZERO;

        BigDecimal expectedSubtotal =
                item.quantity()
                        .multiply(item.unitPrice())
                        .subtract(discount)
                        .setScale(2, RoundingMode.HALF_UP);

        BigDecimal reportedSubtotal =
                item.subtotal()
                        .setScale(2, RoundingMode.HALF_UP);

        if (!approximatelyEqual(
                expectedSubtotal,
                reportedSubtotal
        )) {

            warnings.add(
                    "El subtotal del producto " +
                            itemNumber +
                            " no coincide con cantidad × precio - descuento."
            );
        }
    }

    private void validateTotals(
            InvoiceExtractionResponse invoice,
            List<String> warnings
    ) {

        if (invoice.total() == null) {
            warnings.add(
                    "No se pudo identificar el total de la venta."
            );
            return;
        }

        if (invoice.total()
                .compareTo(BigDecimal.ZERO) < 0) {

            warnings.add(
                    "El total identificado es negativo."
            );
        }

        if (invoice.subtotal() == null) {
            return;
        }

        BigDecimal discount =
                invoice.discount() != null
                        ? invoice.discount()
                        : BigDecimal.ZERO;

        BigDecimal tax =
                invoice.tax() != null
                        ? invoice.tax()
                        : BigDecimal.ZERO;

        BigDecimal expectedTotal =
                invoice.subtotal()
                        .subtract(discount)
                        .add(tax)
                        .setScale(2, RoundingMode.HALF_UP);

        BigDecimal reportedTotal =
                invoice.total()
                        .setScale(2, RoundingMode.HALF_UP);

        if (!approximatelyEqual(
                expectedTotal,
                reportedTotal
        )) {

            warnings.add(
                    "El total identificado no coincide con subtotal - descuento + impuestos."
            );
        }
    }

    private boolean approximatelyEqual(
            BigDecimal first,
            BigDecimal second
    ) {

        return first
                .subtract(second)
                .abs()
                .compareTo(MONEY_TOLERANCE) <= 0;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}