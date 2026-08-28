package com.wisepick.products.controller;

import com.wisepick.products.dto.ProductRequest;
import com.wisepick.products.dto.ProductResponse;
import com.wisepick.products.service.ProductService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/products")
public class ProductController {


    private final ProductService
            productService;


    public ProductController(
            ProductService productService
    ) {

        this.productService =
                productService;

    }


    /* ==========================
       HEALTH
    ========================== */

    @GetMapping("/health")
    public ResponseEntity<String>
    health() {

        return ResponseEntity.ok(
                "products-service OK"
        );

    }


    /* ==========================
       CREATE
    ========================== */

    @PostMapping
    public ResponseEntity<ProductResponse>
    create(
            Authentication authentication,
            @Valid
            @RequestBody
            ProductRequest request
    ) {


        ProductResponse response =
                productService.create(
                        authentication.getName(),
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
    public ResponseEntity<List<ProductResponse>>
    findAll(
            Authentication authentication
    ) {


        return ResponseEntity.ok(
                productService.findAll(
                        authentication.getName()
                )
        );

    }


    /* ==========================
       GET ACTIVE
    ========================== */

    @GetMapping("/active")
    public ResponseEntity<List<ProductResponse>>
    findActive(
            Authentication authentication
    ) {


        return ResponseEntity.ok(
                productService.findActive(
                        authentication.getName()
                )
        );

    }


    /* ==========================
       GET BY ID
    ========================== */

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse>
    findById(
            Authentication authentication,
            @PathVariable
            String id
    ) {


        return ResponseEntity.ok(
                productService.findById(
                        authentication.getName(),
                        id
                )
        );

    }


    /* ==========================
       UPDATE
    ========================== */

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse>
    update(
            Authentication authentication,
            @PathVariable
            String id,
            @Valid
            @RequestBody
            ProductRequest request
    ) {


        return ResponseEntity.ok(
                productService.update(
                        authentication.getName(),
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


        productService.delete(
                authentication.getName(),
                id
        );


        return ResponseEntity
                .noContent()
                .build();

    }

}
