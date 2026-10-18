package com.grainguard.controller;

import com.grainguard.dto.ApiResponse;
import com.grainguard.dto.DistributionRequest;
import com.grainguard.dto.DistributionTransactionDTO;
import com.grainguard.service.DistributionService;
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
@RequestMapping("/api/distributions")
@Tag(name = "Beneficiary Distribution", description = "Endpoints for distributing food grains to beneficiaries at Ration Shops")
public class DistributionController {

    @Autowired
    private DistributionService distributionService;

    @GetMapping
    @Operation(summary = "Get all distribution transactions")
    public ResponseEntity<ApiResponse<List<DistributionTransactionDTO>>> getAllDistributions() {
        return ResponseEntity.ok(ApiResponse.success(distributionService.getAllDistributions(), "Distributions retrieved successfully"));
    }

    @GetMapping("/shop/{shopId}")
    @Operation(summary = "Get distribution transactions for a specific Ration Shop")
    public ResponseEntity<ApiResponse<List<DistributionTransactionDTO>>> getDistributionsByShop(@PathVariable Long shopId) {
        return ResponseEntity.ok(ApiResponse.success(distributionService.getDistributionsByShop(shopId), "Shop distributions retrieved"));
    }

    @GetMapping("/beneficiary/{beneficiaryId}")
    @Operation(summary = "Get distribution history for a specific beneficiary")
    public ResponseEntity<ApiResponse<List<DistributionTransactionDTO>>> getDistributionsByBeneficiary(@PathVariable Long beneficiaryId) {
        return ResponseEntity.ok(ApiResponse.success(distributionService.getDistributionsByBeneficiary(beneficiaryId), "Beneficiary distribution history retrieved"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER', 'FPS_OWNER')")
    @Operation(summary = "Record beneficiary grain distribution transaction")
    public ResponseEntity<ApiResponse<DistributionTransactionDTO>> recordDistribution(@Valid @RequestBody DistributionRequest request, Authentication authentication) {
        DistributionTransactionDTO transaction = distributionService.recordDistribution(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(transaction, "Distribution transaction recorded successfully"));
    }
}
