package com.grainguard.controller;

import com.grainguard.dto.ApiResponse;
import com.grainguard.dto.GodownDTO;
import com.grainguard.dto.GodownRequest;
import com.grainguard.service.GodownService;
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
@RequestMapping("/api/godowns")
@Tag(name = "Godowns", description = "Endpoints for central and regional grain storage godowns")
public class GodownController {

    @Autowired
    private GodownService godownService;

    @GetMapping
    @Operation(summary = "Get all Godowns")
    public ResponseEntity<ApiResponse<List<GodownDTO>>> getAllGodowns() {
        return ResponseEntity.ok(ApiResponse.success(godownService.getAllGodowns(), "Godowns retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Godown by ID")
    public ResponseEntity<ApiResponse<GodownDTO>> getGodownById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(godownService.getGodownById(id), "Godown details retrieved"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    @Operation(summary = "Create new Godown")
    public ResponseEntity<ApiResponse<GodownDTO>> createGodown(@Valid @RequestBody GodownRequest request, Authentication authentication) {
        GodownDTO created = godownService.createGodown(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(created, "Godown created successfully"));
    }
}
