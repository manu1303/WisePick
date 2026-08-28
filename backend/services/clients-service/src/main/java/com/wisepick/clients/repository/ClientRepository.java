package com.wisepick.clients.repository;

import com.wisepick.clients.entity.Client;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface ClientRepository
        extends JpaRepository<Client, String> {


    List<Client>
    findByOwnerUidOrderByCreatedAtDesc(
            String ownerUid
    );


    Optional<Client>
    findByIdAndOwnerUid(
            String id,
            String ownerUid
    );


    List<Client>
    findByOwnerUidAndStatusOrderByNameAsc(
            String ownerUid,
            String status
    );


    Optional<Client>
    findByOwnerUidAndEmail(
            String ownerUid,
            String email
    );

}
