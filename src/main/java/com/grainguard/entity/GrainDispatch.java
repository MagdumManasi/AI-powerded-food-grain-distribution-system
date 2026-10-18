package com.grainguard.entity;

import com.grainguard.entity.enums.Enums.DispatchStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "grain_dispatches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrainDispatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String dispatchCode;

    @Column(nullable = false)
    private Long godownId;

    @Column(nullable = false)
    private Long rationShopId;

    private Long transporterId;

    @Column(nullable = false)
    private Long grainTypeId;

    @Column(nullable = false)
    private Double quantityDispatched;

    private LocalDateTime dispatchDate;
    private String vehicleNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DispatchStatus status = DispatchStatus.CREATED;

    private String createdBy;

    @PrePersist
    protected void onCreate() {
        if (dispatchDate == null) {
            dispatchDate = LocalDateTime.now();
        }
    }
}
