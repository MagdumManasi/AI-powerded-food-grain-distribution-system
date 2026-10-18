package com.grainguard.dto;

import com.grainguard.entity.enums.Enums.LocationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryDTO {
    private Long id;
    private LocationType locationType;
    private Long locationId;
    private String locationName;
    private Long grainTypeId;
    private String grainTypeName;
    private Double quantity;
    private Double minimumThreshold;
    private boolean lowStock;
    private LocalDateTime lastUpdated;
}
