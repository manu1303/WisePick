package com.wisepick.marketingai.client;

import com.wisepick.marketingai.dto.ClientDto;
import com.wisepick.marketingai.dto.ProductDto;
import com.wisepick.marketingai.dto.SaleDto;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.core.ParameterizedTypeReference;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

import org.springframework.stereotype.Component;

import org.springframework.web.client.RestTemplate;

import java.util.List;


@Component
public class WisePickDataClient {


    private final RestTemplate restTemplate;


    @Value("${services.sales.url}")
    private String salesUrl;


    @Value("${services.products.url}")
    private String productsUrl;


    @Value("${services.clients.url}")
    private String clientsUrl;


    public WisePickDataClient() {

        this.restTemplate =
                new RestTemplate();

    }


    /* ============================
       SALES
    ============================ */

    public List<SaleDto> getSales(
            String authorization
    ) {

        HttpEntity<Void> entity =
                createEntity(
                        authorization
                );


        var response =
                restTemplate.exchange(

                        salesUrl +
                                "/api/sales",

                        HttpMethod.GET,

                        entity,

                        new ParameterizedTypeReference<
                                List<SaleDto>
                                >() {}

                );


        return response.getBody() != null
                ? response.getBody()
                : List.of();

    }


    /* ============================
       PRODUCTS
    ============================ */

    public List<ProductDto> getProducts(
            String authorization
    ) {

        HttpEntity<Void> entity =
                createEntity(
                        authorization
                );


        var response =
                restTemplate.exchange(

                        productsUrl +
                                "/api/products",

                        HttpMethod.GET,

                        entity,

                        new ParameterizedTypeReference<
                                List<ProductDto>
                                >() {}

                );


        return response.getBody() != null
                ? response.getBody()
                : List.of();

    }


    /* ============================
       CLIENTS
    ============================ */

    public List<ClientDto> getClients(
            String authorization
    ) {

        HttpEntity<Void> entity =
                createEntity(
                        authorization
                );


        var response =
                restTemplate.exchange(

                        clientsUrl +
                                "/api/clients",

                        HttpMethod.GET,

                        entity,

                        new ParameterizedTypeReference<
                                List<ClientDto>
                                >() {}

                );


        return response.getBody() != null
                ? response.getBody()
                : List.of();

    }


    /* ============================
       AUTHORIZATION HEADER
    ============================ */

    private HttpEntity<Void> createEntity(
            String authorization
    ) {

        HttpHeaders headers =
                new HttpHeaders();


        headers.set(
                HttpHeaders.AUTHORIZATION,
                authorization
        );


        return new HttpEntity<>(
                headers
        );

    }

}