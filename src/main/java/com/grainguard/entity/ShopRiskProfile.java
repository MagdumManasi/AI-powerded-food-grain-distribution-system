package com.grainguard.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "shop_risk_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopRiskProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long shopId;

    @Column(nullable = false)
    @Builder.Default
    private Double riskScore = 0.0; // 0 to 100

    @Builder.Default
    private Double stockRisk = 0.0;

    @Builder.Default
    private Double distributionRisk = 0.0;

    @Builder.Default
    private Double transactionRisk = 0.0;

    @Builder.Default
    private Double beneficiaryRisk = 0.0;

    private LocalDateTime lastCalculatedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        lastCalculatedAt = LocalDateTime.now();
    }
}
