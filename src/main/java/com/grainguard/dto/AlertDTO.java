package com.grainguard.dto;

import com.grainguard.entity.enums.Enums.AlertSeverity;
import com.grainguard.entity.enums.Enums.AlertStatus;
import com.grainguard.entity.enums.Enums.AlertType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertDTO {
    private Long id;
    private String alertCode;
    private AlertType type;
    private AlertSeverity severity;
    private String entityType;
    private Long entityId;
    private String entityName;
    private String title;
    private String description;
    private String evidence;
    private AlertStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
    private String reviewedBy;
    private String resolutionNotes;
}
