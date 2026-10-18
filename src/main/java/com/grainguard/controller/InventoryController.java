package com.grainguard.controller;

import com.grainguard.dto.ApiResponse;
import com.grainguard.dto.InventoryDTO;
import com.grainguard.dto.InventoryTransferRequest;
import com.grainguard.entity.enums.Enums.LocationType;
import com.grainguard.service.InventoryService;
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
@RequestMapping("/api/inventory")
@Tag(name = "Inventory", description = "Endpoints for grain inventory tracking and stock transfers")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    @Operation(summary = "Get overall inventory list")
    public ResponseEntity<ApiResponse<List<InventoryDTO>>> getAllInventories() {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getAllInventories(), "Inventories retrieved successfully"));
    }

    @GetMapping("/{locationType}/{locationId}")
    @Operation(summary = "Get inventory for a specific Godown or Ration Shop")
    public ResponseEntity<ApiResponse<List<InventoryDTO>>> getInventoryByLocation(@PathVariable LocationType locationType, @PathVariable Long locationId) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getInventoryByLocation(locationType, locationId), "Location inventory retrieved"));
    }

    @PostMapping("/transfer")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    @Operation(summary = "Transfer stock between storage locations")
    public ResponseEntity<ApiResponse<Void>> transferStock(@Valid @RequestBody InventoryTransferRequest request, Authentication authentication) {
        inventoryService.transferStock(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(null, "Stock transfer completed successfully"));
    }
}
