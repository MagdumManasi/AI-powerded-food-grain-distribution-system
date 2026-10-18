package com.grainguard.entity;

import com.grainguard.entity.enums.Enums.RationCardType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "entitlement_rules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntitlementRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RationCardType rationCardType;

    @Column(nullable = false)
    private Long grainTypeId;

    @Column(nullable = false)
    private Double quantityPerPerson; // KG per person per month (or total per family depending on scheme)

    private LocalDate effectiveFrom;
    private LocalDate effectiveTo;

    @Builder.Default
    private boolean active = true;
}
