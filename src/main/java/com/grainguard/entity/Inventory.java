package com.grainguard.entity;

import com.grainguard.entity.enums.Enums.LocationType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventories", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"locationType", "locationId", "grainTypeId"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LocationType locationType; // GODOWN, RATION_SHOP

    @Column(nullable = false)
    private Long locationId;

    @Column(nullable = false)
    private Long grainTypeId;

    @Column(nullable = false)
    @Builder.Default
    private Double quantity = 0.0;

    @Builder.Default
    private Double minimumThreshold = 100.0;

    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        lastUpdated = LocalDateTime.now();
    }
}
