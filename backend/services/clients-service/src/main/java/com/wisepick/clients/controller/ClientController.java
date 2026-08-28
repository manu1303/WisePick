package com.wisepick.clients.controller;

import com.wisepick.clients.dto.ClientRequest;
import com.wisepick.clients.dto.ClientResponse;
import com.wisepick.clients.service.ClientService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/clients")
public class ClientController {


    private final ClientService clientService;


    public ClientController(
            ClientService clientService
    ) {

        this.clientService =
                clientService;

    }


    @GetMapping("/health")
    public ResponseEntity<String> health() {

        return ResponseEntity.ok(
                "clients-service OK"
        );

    }


    @GetMapping
    public ResponseEntity<List<ClientResponse>> getAll(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                clientService.getAll(
                        authentication.getName()
                )
        );

    }


    @GetMapping("/active")
    public ResponseEntity<List<ClientResponse>> getActive(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                clientService.getActive(
                        authentication.getName()
                )
        );

    }


    @GetMapping("/{id}")
    public ResponseEntity<ClientResponse> getById(
            @PathVariable String id,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                clientService.getById(
                        id,
                        authentication.getName()
                )
        );

    }


    @PostMapping
    public ResponseEntity<ClientResponse> create(
            @Valid
            @RequestBody
            ClientRequest request,
            Authentication authentication
    ) {

        ClientResponse response =
                clientService.create(
                        request,
                        authentication.getName()
                );


        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(
                        response
                );

    }


    @PutMapping("/{id}")
    public ResponseEntity<ClientResponse> update(
            @PathVariable String id,
            @Valid
            @RequestBody
            ClientRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                clientService.update(
                        id,
                        request,
                        authentication.getName()
                )
        );

    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id,
            Authentication authentication
    ) {

        clientService.delete(
                id,
                authentication.getName()
        );


        return ResponseEntity
                .noContent()
                .build();

    }

}
