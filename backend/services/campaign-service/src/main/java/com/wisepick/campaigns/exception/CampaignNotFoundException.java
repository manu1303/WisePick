package com.wisepick.campaigns.exception;


public class CampaignNotFoundException
        extends RuntimeException {


    public CampaignNotFoundException(
            String message
    ) {

        super(message);

    }

}