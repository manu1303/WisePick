package com.wisepick.products.service;

import com.wisepick.products.dto.ProductRequest;
import com.wisepick.products.dto.ProductResponse;
import com.wisepick.products.entity.Product;
import com.wisepick.products.exception.ProductNotFoundException;
import com.wisepick.products.repository.ProductRepository;

import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ProductService {


    private final ProductRepository
            productRepository;


    public ProductService(
            ProductRepository productRepository
    ) {

        this.productRepository =
                productRepository;

    }


    /* ==========================
       CREATE
    ========================== */

    public ProductResponse create(
            String ownerUid,
            ProductRequest request
    ) {


        Product product =
                new Product();


        applyRequest(
                product,
                request
        );


        product.setOwnerUid(
                ownerUid
        );


        Product saved =
                productRepository.save(
                        product
                );


        return toResponse(
                saved
        );

    }


    /* ==========================
       GET ALL
    ========================== */

    public List<ProductResponse> findAll(
            String ownerUid
    ) {


        return productRepository
                .findByOwnerUidOrderByCreatedAtDesc(
                        ownerUid
                )
                .stream()
                .map(
                        this::toResponse
                )
                .toList();

    }


    /* ==========================
       GET BY ID
    ========================== */

    public ProductResponse findById(
            String ownerUid,
            String id
    ) {


        Product product =
                findOwnedProduct(
                        ownerUid,
                        id
                );


        return toResponse(
                product
        );

    }


    /* ==========================
       UPDATE
    ========================== */

    public ProductResponse update(
            String ownerUid,
            String id,
            ProductRequest request
    ) {


        Product product =
                findOwnedProduct(
                        ownerUid,
                        id
                );


        applyRequest(
                product,
                request
        );


        Product updated =
                productRepository.save(
                        product
                );


        return toResponse(
                updated
        );

    }


    /* ==========================
       DELETE
    ========================== */

    public void delete(
            String ownerUid,
            String id
    ) {


        Product product =
                findOwnedProduct(
                        ownerUid,
                        id
                );


        productRepository.delete(
                product
        );

    }


    /* ==========================
       ACTIVE PRODUCTS
    ========================== */

    public List<ProductResponse> findActive(
            String ownerUid
    ) {


        return productRepository
                .findByOwnerUidAndStatusOrderByNameAsc(
                        ownerUid,
                        "ACTIVE"
                )
                .stream()
                .map(
                        this::toResponse
                )
                .toList();

    }


    /* ==========================
       FIND OWNED PRODUCT
    ========================== */

    private Product findOwnedProduct(
            String ownerUid,
            String id
    ) {


        return productRepository
                .findByIdAndOwnerUid(
                        id,
                        ownerUid
                )
                .orElseThrow(
                        () ->
                                new ProductNotFoundException(
                                        "Producto no encontrado"
                                )
                );

    }


    /* ==========================
       APPLY REQUEST
    ========================== */

    private void applyRequest(
            Product product,
            ProductRequest request
    ) {


        product.setCompanyId(
                request.getCompanyId()
        );


        product.setName(
                request.getName()
        );


        product.setCategory(
                request.getCategory()
        );


        product.setSku(
                request.getSku()
        );


        product.setCost(
                request.getCost()
        );


        product.setPrice(
                request.getPrice()
        );


        product.setStock(
                request.getStock()
        );


        product.setStatus(

                request.getStatus() == null ||
                request.getStatus().isBlank()

                        ? "ACTIVE"

                        : request
                            .getStatus()
                            .toUpperCase()

        );

    }


    /* ==========================
       RESPONSE
    ========================== */

    private ProductResponse toResponse(
            Product product
    ) {


        ProductResponse response =
                new ProductResponse();


        response.setId(
                product.getId()
        );


        response.setCompanyId(
                product.getCompanyId()
        );


        response.setName(
                product.getName()
        );


        response.setCategory(
                product.getCategory()
        );


        response.setSku(
                product.getSku()
        );


        response.setCost(
                product.getCost()
        );


        response.setPrice(
                product.getPrice()
        );


        response.setStock(
                product.getStock()
        );


        response.setStatus(
                product.getStatus()
        );


        response.setCreatedAt(
                product.getCreatedAt()
        );


        response.setUpdatedAt(
                product.getUpdatedAt()
        );


        return response;

    }

}