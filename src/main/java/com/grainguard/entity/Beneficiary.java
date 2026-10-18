package com.grainguard.entity;

import com.grainguard.entity.enums.Enums.BeneficiaryStatus;
import com.grainguard.entity.enums.Enums.RationCardType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "beneficiaries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Beneficiary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String beneficiaryCode;

    @Column(nullable = false)
    private String name;

    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String district;
    private String state;

    @Column(nullable = false, unique = true)
    private String rationCardNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RationCardType rationCardType;

    @Column(nullable = false)
    @Builder.Default
    private Integer familySize = 1;

    private Long assignedShopId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BeneficiaryStatus status = BeneficiaryStatus.ACTIVE;

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
