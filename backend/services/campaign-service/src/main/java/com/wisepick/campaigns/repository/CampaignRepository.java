package com.wisepick.campaigns.repository;

import com.wisepick.campaigns.entity.Campaign;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface CampaignRepository
        extends JpaRepository<Campaign, String> {


    List<Campaign>
    findByOwnerUidOrderByCreatedAtDesc(
            String ownerUid
    );


    Optional<Campaign>
    findByIdAndOwnerUid(
            String id,
            String ownerUid
    );


    List<Campaign>
    findByOwnerUidAndStatusOrderByCreatedAtDesc(
            String ownerUid,
            String status
    );


    List<Campaign>
    findByOwnerUidAndSourceOrderByCreatedAtDesc(
            String ownerUid,
            String source
    );

}
