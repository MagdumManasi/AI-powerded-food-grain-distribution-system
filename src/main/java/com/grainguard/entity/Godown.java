package com.grainguard.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "godowns")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Godown {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String godownCode;

    @Column(nullable = false)
    private String name;

    private String location;
    private String district;
    private Double capacity; // in KG or Metric Tons

    @Builder.Default
    private String currentStatus = "ACTIVE";

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
