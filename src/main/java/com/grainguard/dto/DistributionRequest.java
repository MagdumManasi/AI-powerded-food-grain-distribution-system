package com.grainguard.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DistributionRequest {

    @NotBlank(message = "Transaction code is required")
    private String transactionCode;

    @NotNull(message = "Beneficiary ID is required")
    private Long beneficiaryId;

    @NotNull(message = "Ration shop ID is required")
    private Long rationShopId;

    @NotNull(message = "Grain type ID is required")
    private Long grainTypeId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Double quantity;

    private String remarks;
}
