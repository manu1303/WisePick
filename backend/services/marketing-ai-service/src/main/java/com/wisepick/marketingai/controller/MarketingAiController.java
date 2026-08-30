package com.wisepick.marketingai.controller;

import com.wisepick.marketingai.client.WisePickDataClient;

import com.wisepick.marketingai.dto.MarketingAnalysisResponse;

import com.wisepick.marketingai.service.MarketingAiService;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;


@RestController
@RequestMapping(
        "/api/marketing-ai"
)
public class MarketingAiController {


    private final WisePickDataClient dataClient;

    private final MarketingAiService marketingAiService;


    public MarketingAiController(

            WisePickDataClient dataClient,

            MarketingAiService marketingAiService

    ) {

        this.dataClient =
                dataClient;

        this.marketingAiService =
                marketingAiService;

    }


    /* ============================
       HEALTH
    ============================ */

    @GetMapping(
            "/health"
    )
    public ResponseEntity<String> health() {

        return ResponseEntity.ok(
                "marketing-ai-service OK"
        );

    }


    /* ============================
       DATA TEST
    ============================ */

    @GetMapping(
            "/data-test"
    )
    public ResponseEntity<
            Map<String, Object>
            > dataTest(

            @RequestHeader(
                    "Authorization"
            )
            String authorization

    ) {


        var sales =
                dataClient.getSales(
                        authorization
                );


        var products =
                dataClient.getProducts(
                        authorization
                );


        var clients =
                dataClient.getClients(
                        authorization
                );


        Map<String, Object> result =
                new LinkedHashMap<>();


        result.put(
                "sales",
                sales.size()
        );


        result.put(
                "products",
                products.size()
        );


        result.put(
                "clients",
                clients.size()
        );


        result.put(
                "message",
                "WisePick services connected"
        );


        return ResponseEntity.ok(
                result
        );

    }


    /* ============================
       INSIGHTS
    ============================ */

    @GetMapping(
            "/insights"
    )
    public ResponseEntity<
            MarketingAnalysisResponse
            > insights(

            @RequestHeader(
                    "Authorization"
            )
            String authorization

    ) {


        return ResponseEntity.ok(

                marketingAiService
                        .analyze(
                                authorization
                        )

        );

    }

}