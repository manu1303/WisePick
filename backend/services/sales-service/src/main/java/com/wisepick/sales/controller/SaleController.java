package com.wisepick.sales.controller;

import com.wisepick.sales.dto.SaleRequest;
import com.wisepick.sales.dto.SaleResponse;

import com.wisepick.sales.service.SaleService;

import jakarta.validation.Valid;

import org.springframework.format.annotation.DateTimeFormat;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

import java.util.List;

import com.wisepick.sales.dto.SaleImportResponse;
import com.wisepick.sales.service.SaleImportService;

import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/sales")
public class SaleController {


    private final SaleService
            saleService;

    private final SaleImportService
        saleImportService;    


    public SaleController(
        SaleService saleService,
        SaleImportService saleImportService
        ) {

        this.saleService =
                saleService;

        this.saleImportService =
                saleImportService;

        }


    /* ==========================
       HEALTH
    ========================== */

    @GetMapping("/health")
    public ResponseEntity<String>
            health() {


        return ResponseEntity.ok(
                "WisePick Sales Service is running"
        );

    }


    /* ==========================
       CREATE
    ========================== */

    @PostMapping
    public ResponseEntity<SaleResponse>
            create(

                    Authentication authentication,

                    @Valid
                    @RequestBody
                    SaleRequest request

            ) {


        String ownerUid =
                authentication.getName();


        SaleResponse response =
                saleService.create(
                        ownerUid,
                        request
                );


        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(
                        response
                );

    }


    /* ==========================
       GET ALL
    ========================== */

    @GetMapping
    public ResponseEntity<List<SaleResponse>>
            findAll(
                    Authentication authentication
            ) {


        String ownerUid =
                authentication.getName();


        return ResponseEntity.ok(

                saleService.findAll(
                        ownerUid
                )

        );

    }


    /* ==========================
       FILTER BY DATE
    ========================== */

    @GetMapping("/filter")
    public ResponseEntity<List<SaleResponse>>
            filter(

                    Authentication authentication,

                    @RequestParam
                    @DateTimeFormat(
                            iso = DateTimeFormat.ISO.DATE
                    )
                    LocalDate startDate,

                    @RequestParam
                    @DateTimeFormat(
                            iso = DateTimeFormat.ISO.DATE
                    )
                    LocalDate endDate

            ) {


        String ownerUid =
                authentication.getName();


        return ResponseEntity.ok(

                saleService.findByDateRange(
                        ownerUid,
                        startDate,
                        endDate
                )

        );

    }

    /* ==========================
        IMPORT EXCEL
    ========================== */

        @PostMapping("/import")
        public ResponseEntity<SaleImportResponse>
                importExcel(

                        Authentication authentication,

                        @RequestParam(
                                "companyId"
                        )
                        String companyId,

                        @RequestParam(
                                "file"
                        )
                        MultipartFile file

                ) {


        String ownerUid =
                authentication
                        .getName();


        SaleImportResponse response =
                saleImportService
                        .importExcel(

                                ownerUid,

                                companyId,

                                file

                        );


        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(
                        response
                );

        }


    /* ==========================
       GET BY ID
    ========================== */

    @GetMapping("/{id}")
    public ResponseEntity<SaleResponse>
            findById(

                    Authentication authentication,

                    @PathVariable
                    String id

            ) {


        String ownerUid =
                authentication.getName();


        return ResponseEntity.ok(

                saleService.findById(
                        ownerUid,
                        id
                )

        );

    }


    /* ==========================
       UPDATE
    ========================== */

    @PutMapping("/{id}")
    public ResponseEntity<SaleResponse>
            update(

                    Authentication authentication,

                    @PathVariable
                    String id,

                    @Valid
                    @RequestBody
                    SaleRequest request

            ) {


        String ownerUid =
                authentication.getName();


        return ResponseEntity.ok(

                saleService.update(
                        ownerUid,
                        id,
                        request
                )

        );

    }


    /* ==========================
       DELETE
    ========================== */

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
            delete(

                    Authentication authentication,

                    @PathVariable
                    String id

            ) {


        String ownerUid =
                authentication.getName();


        saleService.delete(
                ownerUid,
                id
        );


        return ResponseEntity
                .noContent()
                .build();

    }

}
