package com.grainguard.dto;

import com.grainguard.entity.enums.Enums.ShopStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RationShopRequest {

    @NotBlank(message = "Shop code is required")
    private String shopCode;

    @NotBlank(message = "Shop name is required")
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
}
