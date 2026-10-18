package com.grainguard.ai.agent;

import com.grainguard.dto.InventoryDTO;
import com.grainguard.dto.RationShopDTO;
import com.grainguard.entity.enums.Enums.AuditAction;
import com.grainguard.entity.enums.Enums.LocationType;
import com.grainguard.service.AuditLogService;
import com.grainguard.service.BeneficiaryService;
import com.grainguard.service.InventoryService;
import com.grainguard.service.RationShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class DemandPlanningAgentService {

    @Autowired
    private RationShopService rationShopService;

    @Autowired
    private BeneficiaryService beneficiaryService;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private AuditLogService auditLogService;

    public Map<String, Object> generateDemandRecommendation(Long shopId, String requestedBy) {
        RationShopDTO shop = rationShopService.getShopById(shopId);
        int beneficiaryCount = beneficiaryService.getBeneficiariesByShop(shopId).size();

        List<InventoryDTO> inventories = inventoryService.getInventoryByLocation(LocationType.RATION_SHOP, shopId);

        double currentRiceStock = inventories.stream()
                .filter(i -> "RICE".equalsIgnoreCase(i.getGrainTypeName()))
                .mapToDouble(InventoryDTO::getQuantity)
                .findFirst().orElse(0.0);

        double currentWheatStock = inventories.stream()
                .filter(i -> "WHEAT".equalsIgnoreCase(i.getGrainTypeName()))
                .mapToDouble(InventoryDTO::getQuantity)
                .findFirst().orElse(0.0);

        // Standard PDS allocation estimate: ~35 KG per beneficiary family
        double expectedRiceRequirement = Math.max(4500.0, beneficiaryCount * 25.0);
        double expectedWheatRequirement = Math.max(2500.0, beneficiaryCount * 15.0);

        double recommendedRiceAllocation = Math.max(0.0, expectedRiceRequirement - currentRiceStock);
        double recommendedWheatAllocation = Math.max(0.0, expectedWheatRequirement - currentWheatStock);

        auditLogService.logAction(null, requestedBy, AuditAction.CREATE, "DemandPlanning", shopId, null, "Generated demand allocation recommendation for shop " + shop.getShopCode(), null);

        Map<String, Object> result = new HashMap<>();
        result.put("shopId", shopId);
        result.put("shopCode", shop.getShopCode());
        result.put("shopName", shop.getShopName());
        result.put("beneficiaryCount", beneficiaryCount);

        List<Map<String, Object>> recommendations = new ArrayList<>();

        recommendations.add(Map.of(
                "grainType", "RICE",
                "currentStockKg", currentRiceStock,
                "expectedMonthlyDemandKg", expectedRiceRequirement,
                "recommendedAdditionalAllocationKg", recommendedRiceAllocation,
                "reasoning", String.format("Based on %d registered beneficiary families and current stock of %.1f KG rice, an additional allocation of %.1f KG is recommended for next period.", beneficiaryCount, currentRiceStock, recommendedRiceAllocation)
        ));

        recommendations.add(Map.of(
                "grainType", "WHEAT",
                "currentStockKg", currentWheatStock,
                "expectedMonthlyDemandKg", expectedWheatRequirement,
                "recommendedAdditionalAllocationKg", recommendedWheatAllocation,
                "reasoning", String.format("Based on %d registered beneficiary families and current stock of %.1f KG wheat, an additional allocation of %.1f KG is recommended for next period.", beneficiaryCount, currentWheatStock, recommendedWheatAllocation)
        ));

        result.put("recommendations", recommendations);
        result.put("generatedAt", LocalDateTime.now());

        return result;
    }
}
