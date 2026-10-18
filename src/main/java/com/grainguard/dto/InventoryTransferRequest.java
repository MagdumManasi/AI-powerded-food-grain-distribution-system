package com.grainguard.dto;

import com.grainguard.entity.enums.Enums.LocationType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InventoryTransferRequest {

    @NotNull(message = "Source location type is required")
    private LocationType sourceLocationType;

    @NotNull(message = "Source location ID is required")
    private Long sourceLocationId;

    @NotNull(message = "Destination location type is required")
    private LocationType destinationLocationType;

    @NotNull(message = "Destination location ID is required")
    private Long destinationLocationId;

    @NotNull(message = "Grain type ID is required")
    private Long grainTypeId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Double quantity;

    private String remarks;
}
