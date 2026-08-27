package com.wisepick.sales.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "sales",
        indexes = {
                @Index(
                        name = "idx_sales_owner_uid",
                        columnList = "owner_uid"
                ),
                @Index(
                        name = "idx_sales_company_id",
                        columnList = "company_id"
                ),
                @Index(
                        name = "idx_sales_sale_date",
                        columnList = "sale_date"
                )
        }
)
public class Sale {


    @Id
    @GeneratedValue(
            strategy = GenerationType.UUID
    )
    private String id;


    @Column(
            name = "owner_uid",
            nullable = false
    )
    private String ownerUid;


    @Column(
            name = "company_id",
            nullable = false
    )
    private String companyId;


    @Column(
            name = "sale_date",
            nullable = false
    )
    private LocalDate saleDate;


    @Column(
            name = "customer_id"
    )
    private String customerId;


    @Column(
            name = "customer_name"
    )
    private String customerName;


    @Column(
            name = "product_id"
    )
    private String productId;


    @Column(
            name = "product_name",
            nullable = false
    )
    private String productName;


    @Column(
            nullable = false
    )
    private Integer quantity;


    @Column(
            name = "unit_price",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal unitPrice;


    @Column(
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal total;


    @Column(
            name = "payment_method"
    )
    private String paymentMethod;


    @Column(
            nullable = false
    )
    private String source;

    @Column(
        name = "notes",
        columnDefinition = "TEXT"
        )
        private String notes;


    @Column(
            name = "created_at",
            nullable = false
    )
    private LocalDateTime createdAt;


    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;


    @PrePersist
    public void prePersist() {

        LocalDateTime now =
                LocalDateTime.now();

        createdAt =
                now;

        updatedAt =
                now;

    }


    @PreUpdate
    public void preUpdate() {

        updatedAt =
                LocalDateTime.now();

    }


    public String getId() {
        return id;
    }


    public void setId(
            String id
    ) {
        this.id = id;
    }


    public String getOwnerUid() {
        return ownerUid;
    }


    public void setOwnerUid(
            String ownerUid
    ) {
        this.ownerUid = ownerUid;
    }


    public String getCompanyId() {
        return companyId;
    }


    public void setCompanyId(
            String companyId
    ) {
        this.companyId = companyId;
    }


    public LocalDate getSaleDate() {
        return saleDate;
    }


    public void setSaleDate(
            LocalDate saleDate
    ) {
        this.saleDate = saleDate;
    }


    public String getCustomerId() {
        return customerId;
    }


    public void setCustomerId(
            String customerId
    ) {
        this.customerId = customerId;
    }


    public String getCustomerName() {
        return customerName;
    }


    public void setCustomerName(
            String customerName
    ) {
        this.customerName = customerName;
    }


    public String getProductId() {
        return productId;
    }


    public void setProductId(
            String productId
    ) {
        this.productId = productId;
    }


    public String getProductName() {
        return productName;
    }


    public void setProductName(
            String productName
    ) {
        this.productName = productName;
    }


    public Integer getQuantity() {
        return quantity;
    }


    public void setQuantity(
            Integer quantity
    ) {
        this.quantity = quantity;
    }


    public BigDecimal getUnitPrice() {
        return unitPrice;
    }


    public void setUnitPrice(
            BigDecimal unitPrice
    ) {
        this.unitPrice = unitPrice;
    }


    public BigDecimal getTotal() {
        return total;
    }


    public void setTotal(
            BigDecimal total
    ) {
        this.total = total;
    }


    public String getPaymentMethod() {
        return paymentMethod;
    }


    public void setPaymentMethod(
            String paymentMethod
    ) {
        this.paymentMethod = paymentMethod;
    }


    public String getSource() {
        return source;
    }


    public void setSource(
            String source
    ) {
        this.source = source;
    }


    public String getNotes() {
        return notes;
        }


        public void setNotes(
                String notes
        ) {
        this.notes = notes;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }


    public void setUpdatedAt(
            LocalDateTime updatedAt
    ) {
        this.updatedAt = updatedAt;
    }

}
