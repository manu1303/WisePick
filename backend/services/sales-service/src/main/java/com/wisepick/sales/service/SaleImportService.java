package com.wisepick.sales.service;

import com.wisepick.sales.dto.SaleImportResponse;
import com.wisepick.sales.entity.Sale;
import com.wisepick.sales.repository.SaleRepository;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

import java.math.BigDecimal;

import java.time.LocalDate;
import java.time.LocalDateTime;

import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import java.util.ArrayList;
import java.util.List;


@Service
public class SaleImportService {


    private final SaleRepository
            saleRepository;


    public SaleImportService(
            SaleRepository saleRepository
    ) {

        this.saleRepository =
                saleRepository;

    }


    public SaleImportResponse importExcel(
            String ownerUid,
            String companyId,
            MultipartFile file
    ) {


        SaleImportResponse response =
                new SaleImportResponse();


        List<String> errors =
                new ArrayList<>();


        int importedRows = 0;

        int failedRows = 0;

        int totalRows = 0;


        try (
                InputStream inputStream =
                        file.getInputStream();

                Workbook workbook =
                        new XSSFWorkbook(
                                inputStream
                        )
        ) {


            Sheet sheet =
                    workbook.getSheetAt(0);


            /*
             * Fila 0 = encabezados.
             *
             * Empezamos desde fila 1.
             */

            for (
                    int rowIndex = 1;
                    rowIndex <= sheet.getLastRowNum();
                    rowIndex++
            ) {


                Row row =
                        sheet.getRow(
                                rowIndex
                        );


                if (
                        row == null ||
                        isEmptyRow(
                                row
                        )
                ) {

                    continue;

                }


                totalRows++;


                try {


                    LocalDate saleDate =
                            readDate(
                                    row.getCell(0)
                            );


                    String customerName =
                            readOptionalString(
                                    row.getCell(1)
                            );


                    String productName =
                            readRequiredString(
                                    row.getCell(2),
                                    "Producto"
                            );


                    Integer quantity =
                            readInteger(
                                    row.getCell(3),
                                    "Cantidad"
                            );


                    BigDecimal unitPrice =
                            readDecimal(
                                    row.getCell(4),
                                    "PrecioUnitario"
                            );


                    String paymentMethod =
                            readOptionalString(
                                    row.getCell(5)
                            );


                    Sale sale =
                            new Sale();


                    sale.setOwnerUid(
                            ownerUid
                    );


                    sale.setCompanyId(
                            companyId
                    );


                    sale.setSaleDate(
                            saleDate
                    );


                    sale.setCustomerName(
                            customerName
                    );


                    sale.setProductName(
                            productName
                    );


                    sale.setQuantity(
                            quantity
                    );


                    sale.setUnitPrice(
                            unitPrice
                    );


                    sale.setTotal(
                            unitPrice.multiply(
                                    BigDecimal.valueOf(
                                            quantity
                                    )
                            )
                    );


                    sale.setPaymentMethod(
                            paymentMethod
                    );


                    sale.setSource(
                            "EXCEL"
                    );


                    sale.setCreatedAt(
                            LocalDateTime.now()
                    );


                    sale.setUpdatedAt(
                            LocalDateTime.now()
                    );


                    saleRepository.save(
                            sale
                    );


                    importedRows++;


                } catch (
                        Exception exception
                ) {


                    failedRows++;


                    errors.add(
                            "Fila "
                                    + (rowIndex + 1)
                                    + ": "
                                    + exception.getMessage()
                    );

                }

            }


        } catch (
                Exception exception
        ) {


            throw new RuntimeException(
                    "No fue posible procesar el archivo Excel.",
                    exception
            );

        }


        response.setTotalRows(
                totalRows
        );


        response.setImportedRows(
                importedRows
        );


        response.setFailedRows(
                failedRows
        );


        response.setErrors(
                errors
        );


        return response;

    }


    /* ==========================
       EMPTY ROW
    ========================== */

    private boolean isEmptyRow(
            Row row
    ) {


        for (
                int i = 0;
                i < 6;
                i++
        ) {


            Cell cell =
                    row.getCell(i);


            if (
                    cell != null &&
                    cell.getCellType()
                            != CellType.BLANK
            ) {

                return false;

            }

        }


        return true;

    }


    /* ==========================
       STRING
    ========================== */

    private String readRequiredString(
            Cell cell,
            String field
    ) {


        String value =
                readOptionalString(
                        cell
                );


        if (
                value == null ||
                value.isBlank()
        ) {

            throw new IllegalArgumentException(
                    field
                            + " es obligatorio."
            );

        }


        return value;

    }


    private String readOptionalString(
            Cell cell
    ) {


        if (
                cell == null ||
                cell.getCellType()
                        == CellType.BLANK
        ) {

            return null;

        }


        DataFormatter formatter =
                new DataFormatter();


        String value =
                formatter
                        .formatCellValue(
                                cell
                        )
                        .trim();


        return value.isBlank()
                ? null
                : value;

    }


    /* ==========================
       INTEGER
    ========================== */

    private Integer readInteger(
            Cell cell,
            String field
    ) {


        if (
                cell == null
        ) {

            throw new IllegalArgumentException(
                    field
                            + " es obligatorio."
            );

        }


        if (
                cell.getCellType()
                        == CellType.NUMERIC
        ) {


            int value =
                    (int)
                            cell.getNumericCellValue();


            if (
                    value <= 0
            ) {

                throw new IllegalArgumentException(
                        field
                                + " debe ser mayor a 0."
                );

            }


            return value;

        }


        try {


            int value =
                    Integer.parseInt(
                            cell
                                    .getStringCellValue()
                                    .trim()
                    );


            if (
                    value <= 0
            ) {

                throw new IllegalArgumentException(
                        field
                                + " debe ser mayor a 0."
                );

            }


            return value;


        } catch (
                Exception exception
        ) {


            throw new IllegalArgumentException(
                    field
                            + " no es válido."
            );

        }

    }


    /* ==========================
       DECIMAL
    ========================== */

    private BigDecimal readDecimal(
            Cell cell,
            String field
    ) {


        if (
                cell == null
        ) {

            throw new IllegalArgumentException(
                    field
                            + " es obligatorio."
            );

        }


        try {


            BigDecimal value;


            if (
                    cell.getCellType()
                            == CellType.NUMERIC
            ) {


                value =
                        BigDecimal.valueOf(
                                cell.getNumericCellValue()
                        );


            } else {


                String text =
                        cell
                                .getStringCellValue()
                                .trim()
                                .replace(
                                        ",",
                                        "."
                                );


                value =
                        new BigDecimal(
                                text
                        );

            }


            if (
                    value.compareTo(
                            BigDecimal.ZERO
                    ) <= 0
            ) {

                throw new IllegalArgumentException(
                        field
                                + " debe ser mayor a 0."
                );

            }


            return value;


        } catch (
                Exception exception
        ) {


            throw new IllegalArgumentException(
                    field
                            + " no es válido."
            );

        }

    }


    /* ==========================
       DATE
    ========================== */

    private LocalDate readDate(
            Cell cell
    ) {


        if (
                cell == null
        ) {

            throw new IllegalArgumentException(
                    "Fecha es obligatoria."
            );

        }


        if (
                cell.getCellType()
                        == CellType.NUMERIC &&
                DateUtil.isCellDateFormatted(
                        cell
                )
        ) {


            return cell
                    .getLocalDateTimeCellValue()
                    .toLocalDate();

        }


        String value =
                readOptionalString(
                        cell
                );


        if (
                value == null
        ) {

            throw new IllegalArgumentException(
                    "Fecha es obligatoria."
            );

        }


        List<DateTimeFormatter> formats =
                List.of(

                        DateTimeFormatter
                                .ofPattern(
                                        "dd/MM/yyyy"
                                ),

                        DateTimeFormatter
                                .ofPattern(
                                        "yyyy-MM-dd"
                                )

                );


        for (
                DateTimeFormatter formatter :
                        formats
        ) {


            try {


                return LocalDate
                        .parse(
                                value,
                                formatter
                        );


            } catch (
                    DateTimeParseException ignored
            ) {

            }

        }


        throw new IllegalArgumentException(
                "Fecha no válida. Usa dd/MM/yyyy."
        );

    }

}
