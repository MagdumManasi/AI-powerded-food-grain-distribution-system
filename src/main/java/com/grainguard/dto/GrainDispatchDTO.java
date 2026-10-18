package com.grainguard.dto;

import com.grainguard.entity.enums.Enums.DispatchStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrainDispatchDTO {
    private Long id;
    private String dispatchCode;
    private Long godownId;
    private String godownName;
    private Long rationShopId;
    private String shopName;
    private Long transporterId;
    private String transporterName;
    private Long grainTypeId;
    private String grainTypeName;
    private Double quantityDispatched;
    private LocalDateTime dispatchDate;
    private String vehicleNumber;
    private DispatchStatus status;
    private String createdBy;
}
