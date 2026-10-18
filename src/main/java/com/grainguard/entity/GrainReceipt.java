package com.grainguard.entity;

import com.grainguard.entity.enums.Enums.ReceiptStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "grain_receipts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrainReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long dispatchId;

    @Column(nullable = false)
    private Double quantityReceived;

    @Column(nullable = false)
    @Builder.Default
    private Double shortageQuantity = 0.0;

    private LocalDateTime receiptDate;
    private String receivedBy;
    private String remarks;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ReceiptStatus status = ReceiptStatus.CONFIRMED;

    @PrePersist
    protected void onCreate() {
        if (receiptDate == null) {
            receiptDate = LocalDateTime.now();
        }
    }
}
