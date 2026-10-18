package com.grainguard.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GrainReceiptRequest {

    @NotNull(message = "Dispatch ID is required")
    private Long dispatchId;

    @NotNull(message = "Quantity received is required")
    @Min(value = 0, message = "Quantity received cannot be negative")
    private Double quantityReceived;

    private String remarks;
}
