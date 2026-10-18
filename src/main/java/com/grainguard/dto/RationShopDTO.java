package com.grainguard.dto;

import com.grainguard.entity.enums.Enums.ShopStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RationShopDTO {
    private Long id;
    private String shopCode;
    private String shopName;
    private String ownerName;
    private String address;
    private String district;
    private String state;
    private Double latitude;
    private Double longitude;
    private Double capacity;
    private ShopStatus currentStatus;
    private String assignedOfficer;
    private Integer beneficiaryCount;
    private Double riskScore;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
