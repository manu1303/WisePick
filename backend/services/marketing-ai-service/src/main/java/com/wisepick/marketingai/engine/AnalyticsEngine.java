package com.wisepick.marketingai.engine;

import com.wisepick.marketingai.dto.ProductDto;
import com.wisepick.marketingai.dto.ProductMetricDto;
import com.wisepick.marketingai.dto.SaleDto;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Component
public class AnalyticsEngine {


    /* ============================
       TOTAL REVENUE
    ============================ */

    public BigDecimal calculateTotalRevenue(
            List<SaleDto> sales
    ) {

        return sales
                .stream()
                .map(
                        sale ->
                                sale.total() != null
                                        ? sale.total()
                                        : BigDecimal.ZERO
                )
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                );

    }


    /* ============================
       IDENTIFIED SALES
    ============================ */

    public int calculateIdentifiedSales(
            List<SaleDto> sales
    ) {

        return (int) sales
                .stream()
                .filter(
                        sale ->
                                sale.customerId() != null
                                        &&
                                !sale.customerId().isBlank()
                )
                .count();

    }


    /* ============================
       IDENTIFIED %
    ============================ */

    public double calculateIdentifiedPercentage(
            List<SaleDto> sales
    ) {

        if (
                sales.isEmpty()
        ) {

            return 0;

        }


        int identified =
                calculateIdentifiedSales(
                        sales
                );


        return (
                (double) identified
                /
                sales.size()
        ) * 100;

    }


    /* ============================
       RECURRING CUSTOMERS
    ============================ */

    public int calculateRecurringCustomers(
            List<SaleDto> sales
    ) {

        Map<String, Integer> purchases =
                new HashMap<>();


        sales
                .stream()
                .filter(
                        sale ->
                                sale.customerId() != null
                                        &&
                                !sale.customerId().isBlank()
                )
                .forEach(
                        sale -> {

                            purchases.merge(
                                    sale.customerId(),
                                    1,
                                    Integer::sum
                            );

                        }
                );


        return (int) purchases
                .values()
                .stream()
                .filter(
                        count ->
                                count >= 2
                )
                .count();

    }


    /* ============================
       LOW STOCK
    ============================ */

    public List<ProductDto> getLowStockProducts(
            List<ProductDto> products
    ) {

        return products
                .stream()
                .filter(
                        product -> {

                            boolean active =
                                    product.status() != null
                                            &&
                                    product.status()
                                            .equalsIgnoreCase(
                                                    "ACTIVE"
                                            );


                            int stock =
                                    product.stock() != null
                                            ? product.stock()
                                            : 0;


                            return active
                                    &&
                                    stock <= 5;

                        }
                )
                .toList();

    }


    /* ============================
       PRODUCT METRICS
    ============================ */

    public List<ProductMetricDto>
    calculateProductMetrics(
            List<SaleDto> sales
    ) {

        Map<String, MutableProductMetric> map =
                new HashMap<>();


        for (
                SaleDto sale : sales
        ) {

            String key =
                    sale.productId() != null
                            &&
                    !sale.productId().isBlank()

                            ? sale.productId()

                            : sale.productName();


            if (
                    key == null ||
                    key.isBlank()
            ) {

                continue;

            }


            MutableProductMetric metric =
                    map.computeIfAbsent(
                            key,
                            ignored ->
                                    new MutableProductMetric(
                                            sale.productId(),
                                            sale.productName()
                                    )
                    );


            int quantity =
                    sale.quantity() != null
                            ? sale.quantity()
                            : 0;


            BigDecimal revenue =
                    sale.total() != null
                            ? sale.total()
                            : BigDecimal.ZERO;


            metric.quantity +=
                    quantity;


            metric.revenue =
                    metric.revenue.add(
                            revenue
                    );

        }


        List<ProductMetricDto> result =
                new ArrayList<>();


        map
                .values()
                .forEach(
                        metric ->
                                result.add(
                                        new ProductMetricDto(
                                                metric.id,
                                                metric.name,
                                                metric.quantity,
                                                metric.revenue
                                        )
                                )
                );


        result.sort(
                Comparator
                        .comparing(
                                ProductMetricDto::quantity
                        )
                        .reversed()
        );


        return result;

    }


    /* ============================
       BEST PRODUCT
    ============================ */

    public ProductMetricDto getBestProduct(
            List<SaleDto> sales
    ) {

        List<ProductMetricDto> metrics =
                calculateProductMetrics(
                        sales
                );


        if (
                metrics.isEmpty()
        ) {

            return null;

        }


        return metrics.get(0);

    }


    /* ============================
       INTERNAL MUTABLE CLASS
    ============================ */

    private static class MutableProductMetric {


        private final String id;

        private final String name;

        private int quantity =
                0;

        private BigDecimal revenue =
                BigDecimal.ZERO;


        private MutableProductMetric(
                String id,
                String name
        ) {

            this.id =
                    id;

            this.name =
                    name;

        }

    }

}