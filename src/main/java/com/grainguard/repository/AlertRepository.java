package com.grainguard.repository;

import com.grainguard.entity.Alert;
import com.grainguard.entity.enums.Enums.AlertStatus;
import com.grainguard.entity.enums.Enums.AlertType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByStatus(AlertStatus status);
    List<Alert> findByType(AlertType type);
    List<Alert> findByEntityTypeAndEntityId(String entityType, Long entityId);
}
