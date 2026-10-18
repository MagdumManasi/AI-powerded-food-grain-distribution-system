package com.grainguard.controller;

import com.grainguard.dto.ApiResponse;
import com.grainguard.dto.BeneficiaryDTO;
import com.grainguard.dto.BeneficiaryRequest;
import com.grainguard.service.BeneficiaryService;
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
@RequestMapping("/api/beneficiaries")
@Tag(name = "Beneficiaries", description = "Endpoints for managing PDS beneficiaries and family members")
public class BeneficiaryController {

    @Autowired
    private BeneficiaryService beneficiaryService;

    @GetMapping
    @Operation(summary = "Get all beneficiaries")
    public ResponseEntity<ApiResponse<List<BeneficiaryDTO>>> getAllBeneficiaries() {
        return ResponseEntity.ok(ApiResponse.success(beneficiaryService.getAllBeneficiaries(), "Beneficiaries retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get beneficiary by ID")
    public ResponseEntity<ApiResponse<BeneficiaryDTO>> getBeneficiaryById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(beneficiaryService.getBeneficiaryById(id), "Beneficiary details retrieved"));
    }

    @GetMapping("/shop/{shopId}")
    @Operation(summary = "Get beneficiaries assigned to a specific Ration Shop")
    public ResponseEntity<ApiResponse<List<BeneficiaryDTO>>> getBeneficiariesByShop(@PathVariable Long shopId) {
        return ResponseEntity.ok(ApiResponse.success(beneficiaryService.getBeneficiariesByShop(shopId), "Shop beneficiaries retrieved"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    @Operation(summary = "Create new beneficiary")
    public ResponseEntity<ApiResponse<BeneficiaryDTO>> createBeneficiary(@Valid @RequestBody BeneficiaryRequest request, Authentication authentication) {
        BeneficiaryDTO created = beneficiaryService.createBeneficiary(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(created, "Beneficiary registered successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    @Operation(summary = "Update beneficiary details")
    public ResponseEntity<ApiResponse<BeneficiaryDTO>> updateBeneficiary(@PathVariable Long id, @Valid @RequestBody BeneficiaryRequest request, Authentication authentication) {
        BeneficiaryDTO updated = beneficiaryService.updateBeneficiary(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(updated, "Beneficiary updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    @Operation(summary = "Deactivate beneficiary")
    public ResponseEntity<ApiResponse<Void>> deleteBeneficiary(@PathVariable Long id, Authentication authentication) {
        beneficiaryService.deleteBeneficiary(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(null, "Beneficiary deactivated successfully"));
    }
}
