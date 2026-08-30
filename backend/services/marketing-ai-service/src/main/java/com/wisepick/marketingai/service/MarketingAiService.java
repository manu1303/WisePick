package com.wisepick.marketingai.service;

import com.wisepick.marketingai.client.WisePickDataClient;

import com.wisepick.marketingai.dto.ClientDto;
import com.wisepick.marketingai.dto.InsightDto;
import com.wisepick.marketingai.dto.MarketingAnalysisResponse;
import com.wisepick.marketingai.dto.MarketingSummaryDto;
import com.wisepick.marketingai.dto.ProductDto;
import com.wisepick.marketingai.dto.ProductMetricDto;
import com.wisepick.marketingai.dto.SaleDto;

import com.wisepick.marketingai.engine.AnalyticsEngine;
import com.wisepick.marketingai.engine.InsightEngine;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

import java.util.List;


@Service
public class MarketingAiService {


    private final WisePickDataClient dataClient;

    private final AnalyticsEngine analyticsEngine;

    private final InsightEngine insightEngine;


    public MarketingAiService(

            WisePickDataClient dataClient,

            AnalyticsEngine analyticsEngine,

            InsightEngine insightEngine

    ) {

        this.dataClient =
                dataClient;

        this.analyticsEngine =
                analyticsEngine;

        this.insightEngine =
                insightEngine;

    }


    /* ============================
       ANALYZE
    ============================ */

    public MarketingAnalysisResponse analyze(
            String authorization
    ) {


        /* ============================
           DATA
        ============================ */

        List<SaleDto> sales =
                dataClient.getSales(
                        authorization
                );


        List<ProductDto> products =
                dataClient.getProducts(
                        authorization
                );


        List<ClientDto> clients =
                dataClient.getClients(
                        authorization
                );


        /*
         * Clients todavía no participa
         * directamente en las reglas.
         *
         * Lo cargamos desde ahora porque
         * será utilizado para segmentación
         * en la siguiente evolución.
         */

        int registeredClients =
                clients.size();


        /* ============================
           ANALYTICS
        ============================ */

        BigDecimal totalRevenue =
                analyticsEngine
                        .calculateTotalRevenue(
                                sales
                        );


        int identifiedSales =
                analyticsEngine
                        .calculateIdentifiedSales(
                                sales
                        );


        double identifiedPercentage =
                analyticsEngine
                        .calculateIdentifiedPercentage(
                                sales
                        );


        int recurringCustomers =
                analyticsEngine
                        .calculateRecurringCustomers(
                                sales
                        );


        List<ProductDto> lowStockProducts =
                analyticsEngine
                        .getLowStockProducts(
                                products
                        );


        ProductMetricDto bestProduct =
                analyticsEngine
                        .getBestProduct(
                                sales
                        );


        /* ============================
           SUMMARY
        ============================ */

        MarketingSummaryDto summary =
                new MarketingSummaryDto(

                        totalRevenue,

                        sales.size(),

                        identifiedSales,

                        identifiedPercentage,

                        recurringCustomers,

                        lowStockProducts.size()

                );


        /* ============================
           INSIGHTS
        ============================ */

        List<InsightDto> insights =
                insightEngine
                        .generateInsights(

                                sales,

                                lowStockProducts,

                                bestProduct,

                                recurringCustomers,

                                identifiedPercentage

                        );


        /* ============================
           RESPONSE
        ============================ */

        return new MarketingAnalysisResponse(

                summary,

                bestProduct,

                insights

        );

    }

}