package com.grainguard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "transporters")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transporter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String transporterCode;

    @Column(nullable = false)
    private String name;

    private String companyName;
    private String vehicleNumber;
    private String phone;

    @Builder.Default
    private String status = "ACTIVE";
}
