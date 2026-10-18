package com.grainguard.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GrainDispatchRequest {

    @NotBlank(message = "Dispatch code is required")
    private String dispatchCode;

    @NotNull(message = "Godown ID is required")
    private Long godownId;

    @NotNull(message = "Ration Shop ID is required")
    private Long rationShopId;

    private Long transporterId;

    @NotNull(message = "Grain Type ID is required")
    private Long grainTypeId;

    @NotNull(message = "Quantity dispatched is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Double quantityDispatched;

    private String vehicleNumber;
}
