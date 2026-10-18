package com.grainguard.controller;

import com.grainguard.dto.ApiResponse;
import com.grainguard.dto.RationShopDTO;
import com.grainguard.dto.RationShopRequest;
import com.grainguard.service.RationShopService;
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
@RequestMapping("/api/ration-shops")
@Tag(name = "Ration Shops", description = "Endpoints for Fair Price Shop (FPS) management and status tracking")
public class RationShopController {

    @Autowired
    private RationShopService rationShopService;

    @GetMapping
    @Operation(summary = "Get all Ration Shops")
    public ResponseEntity<ApiResponse<List<RationShopDTO>>> getAllShops() {
        return ResponseEntity.ok(ApiResponse.success(rationShopService.getAllShops(), "Ration shops retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Ration Shop by ID")
    public ResponseEntity<ApiResponse<RationShopDTO>> getShopById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(rationShopService.getShopById(id), "Shop details retrieved"));
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get Ration Shop by shop code")
    public ResponseEntity<ApiResponse<RationShopDTO>> getShopByCode(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.success(rationShopService.getShopByCode(code), "Shop details retrieved"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    @Operation(summary = "Create new Ration Shop")
    public ResponseEntity<ApiResponse<RationShopDTO>> createShop(@Valid @RequestBody RationShopRequest request, Authentication authentication) {
        RationShopDTO created = rationShopService.createShop(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(created, "Ration shop created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    @Operation(summary = "Update Ration Shop")
    public ResponseEntity<ApiResponse<RationShopDTO>> updateShop(@PathVariable Long id, @Valid @RequestBody RationShopRequest request, Authentication authentication) {
        RationShopDTO updated = rationShopService.updateShop(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(updated, "Ration shop updated successfully"));
    }
}
