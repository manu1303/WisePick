package com.wisepick.sales.service;

import com.wisepick.sales.dto.SaleRequest;
import com.wisepick.sales.dto.SaleResponse;

import com.wisepick.sales.entity.Sale;

import com.wisepick.sales.exception.SaleNotFoundException;

import com.wisepick.sales.repository.SaleRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

import java.util.List;


@Service
public class SaleService {


    private final SaleRepository
            saleRepository;


    public SaleService(
            SaleRepository saleRepository
    ) {

        this.saleRepository =
                saleRepository;

    }


    /* ==========================
       CREATE
    ========================== */

    public SaleResponse create(
            String ownerUid,
            SaleRequest request
    ) {


        Sale sale =
                new Sale();


        applyRequest(
                sale,
                request
        );


        sale.setOwnerUid(
                ownerUid
        );


        Sale saved =
                saleRepository.save(
                        sale
                );


        return toResponse(
                saved
        );

    }


    /* ==========================
       GET ALL
    ========================== */

    public List<SaleResponse> findAll(
            String ownerUid
    ) {


        return saleRepository
                .findByOwnerUidOrderBySaleDateDesc(
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

    public SaleResponse findById(
            String ownerUid,
            String id
    ) {


        Sale sale =
                findOwnedSale(
                        ownerUid,
                        id
                );


        return toResponse(
                sale
        );

    }


    /* ==========================
       UPDATE
    ========================== */

    public SaleResponse update(
            String ownerUid,
            String id,
            SaleRequest request
    ) {


        Sale sale =
                findOwnedSale(
                        ownerUid,
                        id
                );


        applyRequest(
                sale,
                request
        );


        /*
         * No modificamos ownerUid.
         */

        Sale updated =
                saleRepository.save(
                        sale
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


        Sale sale =
                findOwnedSale(
                        ownerUid,
                        id
                );


        saleRepository.delete(
                sale
        );

    }


    /* ==========================
       FILTER BY DATE
    ========================== */

    public List<SaleResponse> findByDateRange(
            String ownerUid,
            LocalDate startDate,
            LocalDate endDate
    ) {


        return saleRepository
                .findByOwnerUidAndSaleDateBetween(
                        ownerUid,
                        startDate,
                        endDate
                )
                .stream()
                .map(
                        this::toResponse
                )
                .toList();

    }


    /* ==========================
       FIND OWNED SALE
    ========================== */

    private Sale findOwnedSale(
            String ownerUid,
            String id
    ) {


        return saleRepository
                .findByIdAndOwnerUid(
                        id,
                        ownerUid
                )
                .orElseThrow(
                        () ->
                                new SaleNotFoundException(
                                        "Venta no encontrada"
                                )
                );

    }


    /* ==========================
       APPLY REQUEST
    ========================== */

    private void applyRequest(
            Sale sale,
            SaleRequest request
    ) {


        sale.setCompanyId(
                request.getCompanyId()
        );


        sale.setSaleDate(
                request.getSaleDate()
        );


        sale.setCustomerId(
                request.getCustomerId()
        );


        sale.setCustomerName(
                request.getCustomerName()
        );


        sale.setProductId(
                request.getProductId()
        );


        sale.setProductName(
                request.getProductName()
        );


        sale.setQuantity(
                request.getQuantity()
        );


        sale.setUnitPrice(
                request.getUnitPrice()
        );


        BigDecimal total =
                request
                        .getUnitPrice()
                        .multiply(
                                BigDecimal.valueOf(
                                        request.getQuantity()
                                )
                        );


        sale.setTotal(
                total
        );


        sale.setPaymentMethod(
                request.getPaymentMethod()
        );


        sale.setSource(

                request.getSource() == null ||
                request.getSource().isBlank()

                        ? "MANUAL"

                        : request.getSource()

        );


        sale.setNotes(
                request.getNotes()
        );

    }


    /* ==========================
       RESPONSE
    ========================== */

    private SaleResponse toResponse(
            Sale sale
    ) {


        SaleResponse response =
                new SaleResponse();


        response.setId(
                sale.getId()
        );


        response.setCompanyId(
                sale.getCompanyId()
        );


        response.setSaleDate(
                sale.getSaleDate()
        );


        response.setCustomerId(
                sale.getCustomerId()
        );


        response.setCustomerName(
                sale.getCustomerName()
        );


        response.setProductId(
                sale.getProductId()
        );


        response.setProductName(
                sale.getProductName()
        );


        response.setQuantity(
                sale.getQuantity()
        );


        response.setUnitPrice(
                sale.getUnitPrice()
        );


        response.setTotal(
                sale.getTotal()
        );


        response.setPaymentMethod(
                sale.getPaymentMethod()
        );


        response.setSource(
                sale.getSource()
        );

        response.setNotes(
                sale.getNotes()
        );


        response.setCreatedAt(
                sale.getCreatedAt()
        );


        response.setUpdatedAt(
                sale.getUpdatedAt()
        );


        return response;

    }

}
