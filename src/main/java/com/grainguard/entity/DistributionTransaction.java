package com.grainguard.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "distribution_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DistributionTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String transactionCode;

    @Column(nullable = false)
    private Long beneficiaryId;

    @Column(nullable = false)
    private Long rationShopId;

    @Column(nullable = false)
    private Long grainTypeId;

    @Column(nullable = false)
    private Double quantity;

    private LocalDateTime distributionDate;
    private String operatorId;

    @Builder.Default
    private String status = "COMPLETED";

    private String remarks;

    @PrePersist
    protected void onCreate() {
        if (distributionDate == null) {
            distributionDate = LocalDateTime.now();
        }
    }
}
