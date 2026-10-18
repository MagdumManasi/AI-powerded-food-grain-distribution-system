package com.grainguard.entity.enums;

public class Enums {

    public enum UserRole {
        ADMIN, OFFICER, FPS_OWNER, TRANSPORTER, AUDITOR
    }

    public enum BeneficiaryStatus {
        ACTIVE, INACTIVE, PENDING_VERIFICATION, SUSPENDED
    }

    public enum RationCardType {
        AAY, PHH, NPHH
    }

    public enum ShopStatus {
        ACTIVE, INACTIVE, UNDER_REVIEW
    }

    public enum LocationType {
        GODOWN, RATION_SHOP
    }

    public enum TransactionType {
        RECEIPT, DISPATCH, TRANSFER, ADJUSTMENT, DISTRIBUTION, RETURN
    }

    public enum DispatchStatus {
        CREATED, IN_TRANSIT, DELIVERED, PARTIALLY_RECEIVED, CANCELLED
    }

    public enum ReceiptStatus {
        CONFIRMED, DISCREPANCY_FLAGGED, UNDER_REVIEW
    }

    public enum AuditAction {
        CREATE, UPDATE, DELETE, LOGIN, STOCK_TRANSFER, DISTRIBUTION, APPROVAL, ALERT_REVIEW, AI_AUDIT
    }

    public enum AlertType {
        STOCK_DISCREPANCY, LOW_STOCK, DISTRIBUTION_ANOMALY, BENEFICIARY_ANOMALY, DUPLICATE_BENEFICIARY, UNUSUAL_TRANSACTION, DEMAND_ANOMALY, AUDIT_FINDING
    }

    public enum AlertSeverity {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum AlertStatus {
        OPEN, UNDER_REVIEW, RESOLVED, FALSE_POSITIVE
    }
}
