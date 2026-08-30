package com.wisepick.marketingai.dto;

import java.util.List;

public record MarketingAnalysisResponse(

        MarketingSummaryDto summary,

        ProductMetricDto bestProduct,

        List<InsightDto> insights

) {}