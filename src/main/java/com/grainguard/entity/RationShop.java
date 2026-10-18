package com.grainguard.entity;

import com.grainguard.entity.enums.Enums.ShopStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ration_shops")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RationShop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String shopCode;

    @Column(nullable = false)
    private String shopName;

    private String ownerName;
    private String address;
    private String district;
    private String state;

    private Double latitude;
    private Double longitude;
    private Double capacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ShopStatus currentStatus = ShopStatus.ACTIVE;

    private String assignedOfficer;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
