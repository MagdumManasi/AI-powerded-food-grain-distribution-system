package com.grainguard.dto;

import com.grainguard.entity.enums.Enums.ReceiptStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrainReceiptDTO {
    private Long id;
    private Long dispatchId;
    private String dispatchCode;
    private Double quantityDispatched;
    private Double quantityReceived;
    private Double shortageQuantity;
    private LocalDateTime receiptDate;
    private String receivedBy;
    private String remarks;
    private ReceiptStatus status;
}
