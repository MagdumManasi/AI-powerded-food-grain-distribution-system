package com.grainguard.service;

import com.grainguard.dto.AlertDTO;
import com.grainguard.dto.AlertReviewRequest;
import com.grainguard.entity.Alert;
import com.grainguard.entity.RationShop;
import com.grainguard.entity.enums.Enums.AlertStatus;
import com.grainguard.entity.enums.Enums.AuditAction;
import com.grainguard.exception.Exceptions.ResourceNotFoundException;
import com.grainguard.repository.AlertRepository;
import com.grainguard.repository.RationShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private RationShopRepository rationShopRepository;

    @Autowired
    private AnomalyEngineService anomalyEngineService;

    @Autowired
    private AuditLogService auditLogService;

    public List<AlertDTO> getAllAlerts() {
        return alertRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public AlertDTO getAlertById(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with id: " + id));
        return mapToDTO(alert);
    }

    public List<AlertDTO> getAlertsByStatus(AlertStatus status) {
        return alertRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AlertDTO reviewAlert(Long id, AlertReviewRequest request, String reviewedBy) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with id: " + id));

        alert.setStatus(request.getStatus());
        alert.setReviewedAt(LocalDateTime.now());
        alert.setReviewedBy(reviewedBy);
        alert.setResolutionNotes(request.getResolutionNotes());

        Alert updated = alertRepository.save(alert);

        if ("RationShop".equalsIgnoreCase(alert.getEntityType()) && alert.getEntityId() != null) {
            anomalyEngineService.updateShopRiskProfile(alert.getEntityId());
        }

        auditLogService.logAction(null, reviewedBy, AuditAction.ALERT_REVIEW, "Alert", updated.getId(), null, "Reviewed alert: " + updated.getAlertCode() + " -> " + updated.getStatus(), null);

        return mapToDTO(updated);
    }

    public AlertDTO mapToDTO(Alert a) {
        String entityName = "N/A";
        if ("RationShop".equalsIgnoreCase(a.getEntityType()) && a.getEntityId() != null) {
            entityName = rationShopRepository.findById(a.getEntityId())
                    .map(RationShop::getShopName)
                    .orElse("Shop #" + a.getEntityId());
        }

        return AlertDTO.builder()
                .id(a.getId())
                .alertCode(a.getAlertCode())
                .type(a.getType())
                .severity(a.getSeverity())
                .entityType(a.getEntityType())
                .entityId(a.getEntityId())
                .entityName(entityName)
                .title(a.getTitle())
                .description(a.getDescription())
                .evidence(a.getEvidence())
                .status(a.getStatus())
                .createdAt(a.getCreatedAt())
                .reviewedAt(a.getReviewedAt())
                .reviewedBy(a.getReviewedBy())
                .resolutionNotes(a.getResolutionNotes())
                .build();
    }
}
