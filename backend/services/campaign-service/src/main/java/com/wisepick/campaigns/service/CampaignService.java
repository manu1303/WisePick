package com.wisepick.campaigns.service;

import com.wisepick.campaigns.dto.CampaignRequest;
import com.wisepick.campaigns.dto.CampaignResponse;
import com.wisepick.campaigns.entity.Campaign;
import com.wisepick.campaigns.exception.CampaignNotFoundException;
import com.wisepick.campaigns.repository.CampaignRepository;

import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CampaignService {


    private final CampaignRepository campaignRepository;


    public CampaignService(
            CampaignRepository campaignRepository
    ) {

        this.campaignRepository =
                campaignRepository;

    }


    public List<CampaignResponse> getAll(
            String ownerUid
    ) {

        return campaignRepository
                .findByOwnerUidOrderByCreatedAtDesc(
                        ownerUid
                )
                .stream()
                .map(
                        this::mapToResponse
                )
                .toList();

    }


    public List<CampaignResponse> getActive(
            String ownerUid
    ) {

        return campaignRepository
                .findByOwnerUidAndStatusOrderByCreatedAtDesc(
                        ownerUid,
                        "ACTIVE"
                )
                .stream()
                .map(
                        this::mapToResponse
                )
                .toList();

    }


    public List<CampaignResponse> getBySource(
            String ownerUid,
            String source
    ) {

        return campaignRepository
                .findByOwnerUidAndSourceOrderByCreatedAtDesc(
                        ownerUid,
                        source.trim().toUpperCase()
                )
                .stream()
                .map(
                        this::mapToResponse
                )
                .toList();

    }


    public CampaignResponse getById(
            String id,
            String ownerUid
    ) {

        Campaign campaign =
                findOwnedCampaign(
                        id,
                        ownerUid
                );


        return mapToResponse(
                campaign
        );

    }


    public CampaignResponse create(
            CampaignRequest request,
            String ownerUid
    ) {

        Campaign campaign =
                new Campaign();


        campaign.setOwnerUid(
                ownerUid
        );


        applyRequest(
                campaign,
                request
        );


        if (
                campaign.getSource() == null ||
                campaign.getSource().isBlank()
        ) {

            campaign.setSource(
                    "MANUAL"
            );

        }


        if (
                campaign.getStatus() == null ||
                campaign.getStatus().isBlank()
        ) {

            campaign.setStatus(
                    "DRAFT"
            );

        }


        Campaign saved =
                campaignRepository.save(
                        campaign
                );


        return mapToResponse(
                saved
        );

    }


    public CampaignResponse update(
            String id,
            CampaignRequest request,
            String ownerUid
    ) {

        Campaign campaign =
                findOwnedCampaign(
                        id,
                        ownerUid
                );


        applyRequest(
                campaign,
                request
        );


        Campaign updated =
                campaignRepository.save(
                        campaign
                );


        return mapToResponse(
                updated
        );

    }


    public void delete(
            String id,
            String ownerUid
    ) {

        Campaign campaign =
                findOwnedCampaign(
                        id,
                        ownerUid
                );


        campaignRepository.delete(
                campaign
        );

    }


    private Campaign findOwnedCampaign(
            String id,
            String ownerUid
    ) {

        return campaignRepository
                .findByIdAndOwnerUid(
                        id,
                        ownerUid
                )
                .orElseThrow(
                        () ->
                                new CampaignNotFoundException(
                                        "Campaña no encontrada"
                                )
                );

    }


    private void applyRequest(
            Campaign campaign,
            CampaignRequest request
    ) {

        campaign.setCompanyId(
                request.getCompanyId()
        );


        campaign.setName(
                request.getName().trim()
        );


        campaign.setObjective(
                normalizeNullable(
                        request.getObjective()
                )
        );


        campaign.setAudience(
                normalizeNullable(
                        request.getAudience()
                )
        );


        campaign.setChannel(
                normalizeNullable(
                        request.getChannel()
                )
        );


        campaign.setMessage(
        normalizeNullable(
                request.getMessage()
        )
        );


        campaign.setTargetType(
                normalizeNullable(
                        request.getTargetType()
                )
        );

        campaign.setTargetId(
                normalizeNullable(
                        request.getTargetId()
                )
        );

        campaign.setTargetName(
                normalizeNullable(
                        request.getTargetName()
                )
        );


        if (
                request.getSource() != null &&
                !request.getSource().isBlank()
        ) {

            campaign.setSource(
                    request
                            .getSource()
                            .trim()
                            .toUpperCase()
                            .replace("-", "_")
            );

        }


        if (
                request.getStatus() != null &&
                !request.getStatus().isBlank()
        ) {

            campaign.setStatus(
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


    private CampaignResponse mapToResponse(
            Campaign campaign
    ) {

        CampaignResponse response =
                new CampaignResponse();


        response.setId(
                campaign.getId()
        );


        response.setCompanyId(
                campaign.getCompanyId()
        );


        response.setName(
                campaign.getName()
        );


        response.setObjective(
                campaign.getObjective()
        );


        response.setAudience(
                campaign.getAudience()
        );


        response.setChannel(
                campaign.getChannel()
        );


        response.setMessage(
                campaign.getMessage()
        );

        response.setTargetType(
                campaign.getTargetType()
        );

        response.setTargetId(
                campaign.getTargetId()
        );

        response.setTargetName(
                campaign.getTargetName()
        );


        response.setSource(
                campaign.getSource()
        );


        response.setStatus(
                campaign.getStatus()
        );


        response.setCreatedAt(
                campaign.getCreatedAt()
        );


        response.setUpdatedAt(
                campaign.getUpdatedAt()
        );


        return response;

    }

}
