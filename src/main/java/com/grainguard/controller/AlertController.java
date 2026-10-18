package com.grainguard.controller;

import com.grainguard.dto.AlertDTO;
import com.grainguard.dto.AlertReviewRequest;
import com.grainguard.dto.ApiResponse;
import com.grainguard.entity.enums.Enums.AlertStatus;
import com.grainguard.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@Tag(name = "Alerts", description = "Endpoints for viewing and reviewing anomaly alerts and human-in-the-loop decisions")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @GetMapping
    @Operation(summary = "Get all system alerts")
    public ResponseEntity<ApiResponse<List<AlertDTO>>> getAllAlerts() {
        return ResponseEntity.ok(ApiResponse.success(alertService.getAllAlerts(), "Alerts retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get alert details by ID")
    public ResponseEntity<ApiResponse<AlertDTO>> getAlertById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(alertService.getAlertById(id), "Alert details retrieved"));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get alerts by status (OPEN, UNDER_REVIEW, RESOLVED, FALSE_POSITIVE)")
    public ResponseEntity<ApiResponse<List<AlertDTO>>> getAlertsByStatus(@PathVariable AlertStatus status) {
        return ResponseEntity.ok(ApiResponse.success(alertService.getAlertsByStatus(status), "Filtered alerts retrieved"));
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER', 'AUDITOR')")
    @Operation(summary = "Review and update alert status (Human Officer decision)")
    public ResponseEntity<ApiResponse<AlertDTO>> reviewAlert(@PathVariable Long id, @Valid @RequestBody AlertReviewRequest request, Authentication authentication) {
        AlertDTO updated = alertService.reviewAlert(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(updated, "Alert status updated successfully"));
    }
}
