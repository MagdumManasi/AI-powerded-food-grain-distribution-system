package com.grainguard.service;

import com.grainguard.entity.Alert;
import com.grainguard.entity.DistributionTransaction;
import com.grainguard.entity.GrainDispatch;
import com.grainguard.entity.GrainReceipt;
import com.grainguard.entity.RationShop;
import com.grainguard.entity.ShopRiskProfile;
import com.grainguard.entity.enums.Enums.AlertSeverity;
import com.grainguard.entity.enums.Enums.AlertStatus;
import com.grainguard.entity.enums.Enums.AlertType;
import com.grainguard.repository.AlertRepository;
import com.grainguard.repository.DistributionTransactionRepository;
import com.grainguard.repository.RationShopRepository;
import com.grainguard.repository.ShopRiskProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AnomalyEngineService {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private RationShopRepository rationShopRepository;

    @Autowired
    private DistributionTransactionRepository distributionTransactionRepository;

    @Autowired
    private ShopRiskProfileRepository shopRiskProfileRepository;

    @Transactional
    public void evaluateStockDiscrepancy(GrainDispatch dispatch, GrainReceipt receipt) {
        double dispatched = dispatch.getQuantityDispatched();
        double received = receipt.getQuantityReceived();
        double shortage = receipt.getShortageQuantity();

        if (shortage <= 0) return;

        double percentage = (shortage / dispatched) * 100.0;

        AlertSeverity severity = AlertSeverity.LOW;
        if (percentage >= 5.0 || shortage >= 100.0) {
            severity = AlertSeverity.HIGH;
        } else if (percentage >= 2.0 || shortage >= 30.0) {
            severity = AlertSeverity.MEDIUM;
        }

        RationShop shop = rationShopRepository.findById(dispatch.getRationShopId()).orElse(null);
        String shopName = shop != null ? shop.getShopName() : "Shop #" + dispatch.getRationShopId();

        String alertCode = "ALT-DISC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String description = String.format("Stock discrepancy detected for dispatch %s to %s. Dispatched: %.1f KG, Received: %.1f KG, Shortage: %.1f KG (%.2f%% deviation).",
                dispatch.getDispatchCode(), shopName, dispatched, received, shortage, percentage);

        String evidence = String.format("Dispatch Code: %s, Vehicle Number: %s, Shortage: %.1f KG (%.2f%%)",
                dispatch.getDispatchCode(), dispatch.getVehicleNumber(), shortage, percentage);

        Alert alert = Alert.builder()
                .alertCode(alertCode)
                .type(AlertType.STOCK_DISCREPANCY)
                .severity(severity)
                .entityType("RationShop")
                .entityId(dispatch.getRationShopId())
                .title("Stock Shortage Discrepancy on Receipt")
                .description(description)
                .evidence(evidence)
                .status(AlertStatus.OPEN)
                .build();

        alertRepository.save(alert);
        updateShopRiskProfile(dispatch.getRationShopId());
    }

    @Transactional
    public void evaluateDistributionDeviation(Long shopId) {
        RationShop shop = rationShopRepository.findById(shopId).orElse(null);
        if (shop == null) return;

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime monthStart = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);

        List<DistributionTransaction> currentMonthTxs = distributionTransactionRepository
                .findByRationShopIdAndDistributionDateBetween(shopId, monthStart, now);

        double totalCurrentDistribution = currentMonthTxs.stream()
                .mapToDouble(DistributionTransaction::getQuantity)
                .sum();

        // Baseline comparison (Demo baseline = 4500.0 kg for demonstration scenarios or historical avg)
        double baselineMonthlyAvg = 4500.0;
        if (totalCurrentDistribution > baselineMonthlyAvg * 1.5) {
            double deviationPercent = ((totalCurrentDistribution - baselineMonthlyAvg) / baselineMonthlyAvg) * 100.0;

            // Check if open alert already exists to prevent duplication
            boolean alertExists = alertRepository.findByEntityTypeAndEntityId("RationShop", shopId).stream()
                    .anyMatch(a -> a.getType() == AlertType.DISTRIBUTION_ANOMALY && a.getStatus() == AlertStatus.OPEN);

            if (!alertExists) {
                String alertCode = "ALT-DIST-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                Alert alert = Alert.builder()
                        .alertCode(alertCode)
                        .type(AlertType.DISTRIBUTION_ANOMALY)
                        .severity(AlertSeverity.HIGH)
                        .entityType("RationShop")
                        .entityId(shopId)
                        .title("Unusual Distribution Volume Deviation")
                        .description(String.format("Current monthly distribution volume for %s is %.1f KG, which is %.1f%% higher than historical baseline (%.1f KG).",
                                shop.getShopName(), totalCurrentDistribution, deviationPercent, baselineMonthlyAvg))
                        .evidence(String.format("Current Distribution: %.1f KG, Historical Baseline: %.1f KG, Deviation: +%.1f%%",
                                totalCurrentDistribution, baselineMonthlyAvg, deviationPercent))
                        .status(AlertStatus.OPEN)
                        .build();

                alertRepository.save(alert);
                updateShopRiskProfile(shopId);
            }
        }
    }

    @Transactional
    public void updateShopRiskProfile(Long shopId) {
        List<Alert> shopAlerts = alertRepository.findByEntityTypeAndEntityId("RationShop", shopId).stream()
                .filter(a -> a.getStatus() == AlertStatus.OPEN || a.getStatus() == AlertStatus.UNDER_REVIEW)
                .toList();

        double stockRisk = shopAlerts.stream().filter(a -> a.getType() == AlertType.STOCK_DISCREPANCY).mapToDouble(a -> a.getSeverity() == AlertSeverity.HIGH ? 35.0 : 15.0).sum();
        double distributionRisk = shopAlerts.stream().filter(a -> a.getType() == AlertType.DISTRIBUTION_ANOMALY).mapToDouble(a -> a.getSeverity() == AlertSeverity.HIGH ? 40.0 : 20.0).sum();
        double transactionRisk = shopAlerts.stream().filter(a -> a.getType() == AlertType.UNUSUAL_TRANSACTION).mapToDouble(a -> 20.0).sum();
        double beneficiaryRisk = shopAlerts.stream().filter(a -> a.getType() == AlertType.BENEFICIARY_ANOMALY || a.getType() == AlertType.DUPLICATE_BENEFICIARY).mapToDouble(a -> 15.0).sum();

        double totalRiskScore = Math.min(100.0, stockRisk + distributionRisk + transactionRisk + beneficiaryRisk);

        ShopRiskProfile profile = shopRiskProfileRepository.findByShopId(shopId)
                .orElseGet(() -> ShopRiskProfile.builder().shopId(shopId).build());

        profile.setRiskScore(totalRiskScore);
        profile.setStockRisk(stockRisk);
        profile.setDistributionRisk(distributionRisk);
        profile.setTransactionRisk(transactionRisk);
        profile.setBeneficiaryRisk(beneficiaryRisk);

        shopRiskProfileRepository.save(profile);
    }
}
