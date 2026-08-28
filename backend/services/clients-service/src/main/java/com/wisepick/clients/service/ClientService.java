package com.wisepick.clients.service;

import com.wisepick.clients.dto.ClientRequest;
import com.wisepick.clients.dto.ClientResponse;
import com.wisepick.clients.entity.Client;
import com.wisepick.clients.exception.ClientNotFoundException;
import com.wisepick.clients.repository.ClientRepository;

import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ClientService {


    private final ClientRepository clientRepository;


    public ClientService(
            ClientRepository clientRepository
    ) {

        this.clientRepository =
                clientRepository;

    }


    public List<ClientResponse> getAll(
            String ownerUid
    ) {

        return clientRepository
                .findByOwnerUidOrderByCreatedAtDesc(
                        ownerUid
                )
                .stream()
                .map(
                        this::mapToResponse
                )
                .toList();

    }


    public List<ClientResponse> getActive(
            String ownerUid
    ) {

        return clientRepository
                .findByOwnerUidAndStatusOrderByNameAsc(
                        ownerUid,
                        "ACTIVE"
                )
                .stream()
                .map(
                        this::mapToResponse
                )
                .toList();

    }


    public ClientResponse getById(
            String id,
            String ownerUid
    ) {

        Client client =
                findOwnedClient(
                        id,
                        ownerUid
                );

        return mapToResponse(
                client
        );

    }


    public ClientResponse create(
            ClientRequest request,
            String ownerUid
    ) {

        Client client =
                new Client();


        client.setOwnerUid(
                ownerUid
        );


        applyRequest(
                client,
                request
        );


        if (
                client.getStatus() == null ||
                client.getStatus().isBlank()
        ) {

            client.setStatus(
                    "ACTIVE"
            );

        }


        Client saved =
                clientRepository.save(
                        client
                );


        return mapToResponse(
                saved
        );

    }


    public ClientResponse update(
            String id,
            ClientRequest request,
            String ownerUid
    ) {

        Client client =
                findOwnedClient(
                        id,
                        ownerUid
                );


        applyRequest(
                client,
                request
        );


        Client updated =
                clientRepository.save(
                        client
                );


        return mapToResponse(
                updated
        );

    }


    public void delete(
            String id,
            String ownerUid
    ) {

        Client client =
                findOwnedClient(
                        id,
                        ownerUid
                );


        clientRepository.delete(
                client
        );

    }


    private Client findOwnedClient(
            String id,
            String ownerUid
    ) {

        return clientRepository
                .findByIdAndOwnerUid(
                        id,
                        ownerUid
                )
                .orElseThrow(
                        () ->
                                new ClientNotFoundException(
                                        "Cliente no encontrado"
                                )
                );

    }


    private void applyRequest(
            Client client,
            ClientRequest request
    ) {

        client.setCompanyId(
                request.getCompanyId()
        );


        client.setName(
                request.getName().trim()
        );


        client.setPhone(
                normalizeNullable(
                        request.getPhone()
                )
        );


        client.setEmail(
                normalizeNullable(
                        request.getEmail()
                )
        );


        client.setCity(
                normalizeNullable(
                        request.getCity()
                )
        );


        if (
                request.getStatus() != null &&
                !request.getStatus().isBlank()
        ) {

            client.setStatus(
                    request
                            .getStatus()
                            .trim()
                            .toUpperCase()
            );

        }

    }


    private String normalizeNullable(
            String value
    ) {

        if (
                value == null
        ) {

            return null;

        }


        String trimmed =
                value.trim();


        return trimmed.isEmpty()
                ? null
                : trimmed;

    }


    private ClientResponse mapToResponse(
            Client client
    ) {

        ClientResponse response =
                new ClientResponse();


        response.setId(
                client.getId()
        );


        response.setCompanyId(
                client.getCompanyId()
        );


        response.setName(
                client.getName()
        );


        response.setPhone(
                client.getPhone()
        );


        response.setEmail(
                client.getEmail()
        );


        response.setCity(
                client.getCity()
        );


        response.setStatus(
                client.getStatus()
        );


        response.setCreatedAt(
                client.getCreatedAt()
        );


        response.setUpdatedAt(
                client.getUpdatedAt()
        );


        return response;

    }

}
