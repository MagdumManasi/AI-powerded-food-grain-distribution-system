package com.grainguard.controller;

import com.grainguard.dto.ApiResponse;
import com.grainguard.dto.GrainReceiptDTO;
import com.grainguard.dto.GrainReceiptRequest;
import com.grainguard.service.ReceiptService;
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
@RequestMapping("/api/receipts")
@Tag(name = "Grain Receipts", description = "Endpoints for confirming shipment receipt at Ration Shops and recording shortage discrepancies")
public class ReceiptController {

    @Autowired
    private ReceiptService receiptService;

    @GetMapping
    @Operation(summary = "Get all grain receipt records")
    public ResponseEntity<ApiResponse<List<GrainReceiptDTO>>> getAllReceipts() {
        return ResponseEntity.ok(ApiResponse.success(receiptService.getAllReceipts(), "Receipts retrieved successfully"));
    }

    @GetMapping("/dispatch/{dispatchId}")
    @Operation(summary = "Get receipt record for a specific dispatch shipment")
    public ResponseEntity<ApiResponse<GrainReceiptDTO>> getReceiptByDispatchId(@PathVariable Long dispatchId) {
        return ResponseEntity.ok(ApiResponse.success(receiptService.getReceiptByDispatchId(dispatchId), "Receipt record retrieved"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER', 'FPS_OWNER', 'TRANSPORTER')")
    @Operation(summary = "Record shipment receipt and calculate shortage discrepancy")
    public ResponseEntity<ApiResponse<GrainReceiptDTO>> recordReceipt(@Valid @RequestBody GrainReceiptRequest request, Authentication authentication) {
        GrainReceiptDTO receipt = receiptService.recordReceipt(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(receipt, "Receipt recorded successfully"));
    }
}
