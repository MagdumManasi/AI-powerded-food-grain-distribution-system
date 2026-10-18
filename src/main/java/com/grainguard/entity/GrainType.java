package com.grainguard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "grain_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrainType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // RICE, WHEAT, COARSE_GRAIN

    @Builder.Default
    private String unit = "KG";

    private String description;
}
