package com.grainguard.ai.agent;

import com.grainguard.ai.rag.RagService;
import com.grainguard.dto.*;
import com.grainguard.entity.ShopRiskProfile;
import com.grainguard.entity.enums.Enums.AlertStatus;
import com.grainguard.entity.enums.Enums.LocationType;
import com.grainguard.repository.ShopRiskProfileRepository;
import com.grainguard.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AgentToolsService {

    @Autowired
    private RationShopService rationShopService;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private DispatchService dispatchService;

    @Autowired
    private ReceiptService receiptService;

    @Autowired
    private DistributionService distributionService;

    @Autowired
    private BeneficiaryService beneficiaryService;

    @Autowired
    private AlertService alertService;

    @Autowired
    private ShopRiskProfileRepository shopRiskProfileRepository;

    @Autowired
    private RagService ragService;

    public Map<String, Object> getShopOverviewTool(Long shopId) {
        RationShopDTO shop = rationShopService.getShopById(shopId);
        List<InventoryDTO> inventory = inventoryService.getInventoryByLocation(LocationType.RATION_SHOP, shopId);
        List<DistributionTransactionDTO> recentDistributions = distributionService.getDistributionsByShop(shopId);
        List<AlertDTO> alerts = alertService.getAllAlerts().stream()
                .filter(a -> "RationShop".equalsIgnoreCase(a.getEntityType()) && shopId.equals(a.getEntityId()))
                .toList();
        ShopRiskProfile riskProfile = shopRiskProfileRepository.findByShopId(shopId).orElse(null);

        Map<String, Object> data = new HashMap<>();
        data.put("shopDetails", shop);
        data.put("inventory", inventory);
        data.put("recentDistributionsCount", recentDistributions.size());
        data.put("recentDistributions", recentDistributions.stream().limit(5).toList());
        data.put("alerts", alerts);
        data.put("riskProfile", riskProfile);

        return data;
    }

    public List<InventoryDTO> getLowStockShopsTool() {
        return inventoryService.getAllInventories().stream()
                .filter(InventoryDTO::isLowStock)
                .toList();
    }

    public List<AlertDTO> getOpenAlertsTool() {
        return alertService.getAlertsByStatus(AlertStatus.OPEN);
    }

    public Map<String, Object> getBeneficiaryAnalysisTool(Long beneficiaryId) {
        BeneficiaryDTO beneficiary = beneficiaryService.getBeneficiaryById(beneficiaryId);
        List<DistributionTransactionDTO> history = distributionService.getDistributionsByBeneficiary(beneficiaryId);

        Map<String, Object> result = new HashMap<>();
        result.put("beneficiary", beneficiary);
        result.put("distributionHistory", history);
        return result;
    }

    public Map<String, Object> searchKnowledgeTool(String question) {
        return ragService.askGroundedPolicyQuestion(question);
    }
}
