package com.grainguard.controller;

import com.grainguard.dto.ApiResponse;
import com.grainguard.entity.enums.Enums.AlertSeverity;
import com.grainguard.entity.enums.Enums.AlertStatus;
import com.grainguard.entity.enums.Enums.AlertType;
import com.grainguard.entity.enums.Enums.LocationType;
import com.grainguard.repository.AlertRepository;
import com.grainguard.repository.BeneficiaryRepository;
import com.grainguard.repository.DistributionTransactionRepository;
import com.grainguard.repository.GodownRepository;
import com.grainguard.repository.GrainTypeRepository;
import com.grainguard.repository.InventoryRepository;
import com.grainguard.repository.RationShopRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Endpoints for executive dashboard analytics and summary stats")
public class DashboardController {

    @Autowired
    private BeneficiaryRepository beneficiaryRepository;

    @Autowired
    private RationShopRepository rationShopRepository;

    @Autowired
    private GodownRepository godownRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private DistributionTransactionRepository distributionTransactionRepository;

    @Autowired
    private GrainTypeRepository grainTypeRepository;

    @GetMapping("/summary")
    @Operation(summary = "Get high-level dashboard metrics and analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();

        long totalBeneficiaries = beneficiaryRepository.count();
        long totalRationShops = rationShopRepository.count();
        long totalGodowns = godownRepository.count();

        // Grain stock totals across all locations
        Long riceTypeId = grainTypeRepository.findByName("RICE").map(g -> g.getId()).orElse(1L);
        Long wheatTypeId = grainTypeRepository.findByName("WHEAT").map(g -> g.getId()).orElse(2L);

        double totalRiceStock = inventoryRepository.findAll().stream()
                .filter(i -> i.getGrainTypeId().equals(riceTypeId))
                .mapToDouble(i -> i.getQuantity())
                .sum();

        double totalWheatStock = inventoryRepository.findAll().stream()
                .filter(i -> i.getGrainTypeId().equals(wheatTypeId))
                .mapToDouble(i -> i.getQuantity())
                .sum();

        long openAlerts = alertRepository.findByStatus(AlertStatus.OPEN).size();
        long highPriorityAlerts = alertRepository.findByStatus(AlertStatus.OPEN).stream()
                .filter(a -> a.getSeverity() == AlertSeverity.HIGH || a.getSeverity() == AlertSeverity.CRITICAL)
                .count();

        long stockDiscrepancies = alertRepository.findByType(AlertType.STOCK_DISCREPANCY).size();
        long distributionCount = distributionTransactionRepository.count();
        long pendingReviews = alertRepository.findByStatus(AlertStatus.UNDER_REVIEW).size();

        summary.put("totalBeneficiaries", totalBeneficiaries);
        summary.put("totalRationShops", totalRationShops);
        summary.put("totalGodowns", totalGodowns);
        summary.put("totalRiceStockKg", totalRiceStock);
        summary.put("totalWheatStockKg", totalWheatStock);
        summary.put("openAlerts", openAlerts);
        summary.put("highPriorityAlerts", highPriorityAlerts);
        summary.put("stockDiscrepancies", stockDiscrepancies);
        summary.put("distributionTransactionsCount", distributionCount);
        summary.put("pendingReviews", pendingReviews);

        // Chart Data 1: Shop-wise distribution
        List<Map<String, Object>> shopStats = rationShopRepository.findAll().stream().map(shop -> {
            Map<String, Object> map = new HashMap<>();
            map.put("shopCode", shop.getShopCode());
            map.put("shopName", shop.getShopName());
            map.put("district", shop.getDistrict());
            double shopDistQty = distributionTransactionRepository.findByRationShopId(shop.getId()).stream()
                    .mapToDouble(d -> d.getQuantity()).sum();
            map.put("totalDistributedKg", shopDistQty);
            return map;
        }).toList();

        summary.put("shopDistributionStats", shopStats);

        return ResponseEntity.ok(ApiResponse.success(summary, "Dashboard summary retrieved successfully"));
    }
}
