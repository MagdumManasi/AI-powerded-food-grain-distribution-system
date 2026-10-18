package com.grainguard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DistributionTransactionDTO {
    private Long id;
    private String transactionCode;
    private Long beneficiaryId;
    private String beneficiaryName;
    private String rationCardNumber;
    private Long rationShopId;
    private String shopName;
    private Long grainTypeId;
    private String grainTypeName;
    private Double quantity;
    private LocalDateTime distributionDate;
    private String operatorId;
    private String status;
    private String remarks;
}
