package com.grainguard.dto;

import com.grainguard.entity.enums.Enums.AlertStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AlertReviewRequest {

    @NotNull(message = "Status is required")
    private AlertStatus status; // UNDER_REVIEW, RESOLVED, FALSE_POSITIVE

    private String resolutionNotes;
}
