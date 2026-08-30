package com.wisepick.marketingai.engine;

import com.wisepick.marketingai.dto.InsightDto;
import com.wisepick.marketingai.dto.ProductDto;
import com.wisepick.marketingai.dto.ProductMetricDto;
import com.wisepick.marketingai.dto.SaleDto;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;


@Component
public class InsightEngine {


    public List<InsightDto> generateInsights(

            List<SaleDto> sales,

            List<ProductDto> lowStockProducts,

            ProductMetricDto bestProduct,

            int recurringCustomers,

            double identifiedPercentage

    ) {


        List<InsightDto> insights =
                new ArrayList<>();


        /* ============================
           PRODUCTO DESTACADO
        ============================ */

        if (
                bestProduct != null
                &&
                bestProduct.quantity() >= 2
        ) {

            insights.add(

                    new InsightDto(

                            "product-highlight",

                            "success",

                            "high",

                            "🔥",

                            "Producto destacado",

                            bestProduct.name()
                                    +
                                    " es actualmente tu producto con mayor número de unidades vendidas.",

                            bestProduct.quantity()
                                    +
                                    " unidades vendidas y $"
                                    +
                                    bestProduct.revenue()
                                            .setScale(
                                                    2
                                            )
                                    +
                                    " en ingresos.",

                            "Crear campaña",

                            "product",

                            bestProduct.id(),

                            bestProduct.name()

                    )

            );

        }


        /* ============================
           CLIENTES RECURRENTES
        ============================ */

        if (
                recurringCustomers > 0
        ) {

            insights.add(

                    new InsightDto(

                            "recurring-customers",

                            "customer",

                            "high",

                            "👥",

                            "Oportunidad de fidelización",

                            "Tienes "
                                    +
                                    recurringCustomers
                                    +
                                    " cliente(s) que han comprado más de una vez.",

                            "Los clientes recurrentes pueden ser candidatos para promociones o campañas de fidelización.",

                            "Crear campaña",

                            "customer",

                            null,

                            null

                    )

            );

        }


        /* ============================
           IDENTIFICACIÓN DE CLIENTES
        ============================ */

        if (
                sales.size() >= 5
                &&
                identifiedPercentage < 60
        ) {

            insights.add(

                    new InsightDto(

                            "customer-identification",

                            "opportunity",

                            "medium",

                            "🎯",

                            "Mejora la identificación de clientes",

                            "Solo el "
                                    +
                                    String.format(
                                            "%.0f",
                                            identifiedPercentage
                                    )
                                    +
                                    "% de tus ventas tienen un cliente identificado.",

                            "Identificar clientes permite mejorar segmentación, recurrencia y campañas personalizadas.",

                            "Ver clientes",

                            "sales",

                            null,

                            null

                    )

            );

        }


        /* ============================
           STOCK BAJO
        ============================ */

        if (
                !lowStockProducts.isEmpty()
        ) {

            insights.add(

                    new InsightDto(

                            "low-stock",

                            "warning",

                            "high",

                            "📦",

                            "Productos con stock bajo",

                            lowStockProducts.size()
                                    +
                                    " producto(s) tienen 5 unidades o menos disponibles.",

                            "Evita promocionar productos con disponibilidad limitada antes de revisar inventario.",

                            "Revisar productos",

                            "inventory",

                            null,

                            null

                    )

            );

        }


        return insights;

    }

}