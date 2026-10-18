package com.grainguard.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "family_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long beneficiaryId;

    @Column(nullable = false)
    private String name;

    private LocalDate dateOfBirth;
    private String relationship;
    private String gender;

    @Builder.Default
    private String status = "ACTIVE";
}
