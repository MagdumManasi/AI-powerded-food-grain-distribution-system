package com.grainguard.controller;

import com.grainguard.dto.ApiResponse;
import com.grainguard.dto.GrainDispatchDTO;
import com.grainguard.dto.GrainDispatchRequest;
import com.grainguard.service.DispatchService;
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
@RequestMapping("/api/dispatch")
@Tag(name = "Grain Dispatch", description = "Endpoints for dispatching food grains from godowns to ration shops")
public class DispatchController {

    @Autowired
    private DispatchService dispatchService;

    @GetMapping
    @Operation(summary = "Get all dispatch shipments")
    public ResponseEntity<ApiResponse<List<GrainDispatchDTO>>> getAllDispatches() {
        return ResponseEntity.ok(ApiResponse.success(dispatchService.getAllDispatches(), "Dispatches retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get dispatch details by ID")
    public ResponseEntity<ApiResponse<GrainDispatchDTO>> getDispatchById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(dispatchService.getDispatchById(id), "Dispatch details retrieved"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    @Operation(summary = "Create a new grain dispatch order")
    public ResponseEntity<ApiResponse<GrainDispatchDTO>> createDispatch(@Valid @RequestBody GrainDispatchRequest request, Authentication authentication) {
        GrainDispatchDTO created = dispatchService.createDispatch(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(created, "Grain dispatch created successfully"));
    }
}
