package com.grainguard.ai.agent;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.grainguard.ai.rag.RagService;
import com.grainguard.ai.service.GeminiService;
import com.grainguard.dto.AlertDTO;
import com.grainguard.dto.InventoryDTO;
import com.grainguard.dto.RationShopDTO;
import com.grainguard.entity.Alert;
import com.grainguard.entity.DocumentChunk;
import com.grainguard.entity.enums.Enums.AlertSeverity;
import com.grainguard.entity.enums.Enums.AlertStatus;
import com.grainguard.entity.enums.Enums.AlertType;
import com.grainguard.entity.enums.Enums.AuditAction;
import com.grainguard.repository.AlertRepository;
import com.grainguard.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AiAuditAgentService {

    @Autowired
    private AgentToolsService agentToolsService;

    @Autowired
    private RagService ragService;

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private AuditLogService auditLogService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public Map<String, Object> runShopAudit(Long shopId, String auditorUsername) {
        Map<String, Object> shopData = agentToolsService.getShopOverviewTool(shopId);

        RationShopDTO shopDetails = (RationShopDTO) shopData.get("shopDetails");
        List<InventoryDTO> inventory = (List<InventoryDTO>) shopData.get("inventory");
        List<AlertDTO> alerts = (List<AlertDTO>) shopData.get("alerts");

        List<DocumentChunk> policyChunks = ragService.searchChunks("stock discrepancy audit procedure distribution guidelines", 3);
        StringBuilder policyContext = new StringBuilder();
        for (DocumentChunk chunk : policyChunks) {
            policyContext.append("- ").append(chunk.getContent()).append("\n");
        }

        String systemPrompt = "You are GrainGuard AI Senior Auditor. Analyze the provided ration shop data and policy guidelines. " +
                "Generate a formal, evidence-based AI Audit Report. Never make accusations of fraud. Use neutral, objective terminology " +
                "such as 'discrepancy', 'unusual pattern', 'requires human officer verification'.\n\n" +
                "PDS POLICY GUIDELINES:\n" + policyContext.toString();

        String userPrompt = String.format("Audit Request for Shop: %s (%s, District: %s)\n" +
                "Current Active Alerts: %d\n" +
                "Inventory Details: %s\n" +
                "Shop Alerts: %s",
                shopDetails.getShopName(), shopDetails.getShopCode(), shopDetails.getDistrict(),
                alerts.size(), inventory.toString(), alerts.toString());

        String aiAnalysis = geminiService.generateResponse(systemPrompt, userPrompt);

        // Record Audit Finding in DB if open high alerts exist
        if (!alerts.isEmpty()) {
            Alert auditAlert = Alert.builder()
                    .alertCode("ALT-AUD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .type(AlertType.AUDIT_FINDING)
                    .severity(AlertSeverity.HIGH)
                    .entityType("RationShop")
                    .entityId(shopId)
                    .title("AI Audit Report Finding for " + shopDetails.getShopCode())
                    .description("AI Audit Agent completed comprehensive shop audit. Findings available for officer review.")
                    .evidence("Audited " + inventory.size() + " inventory items and " + alerts.size() + " active alerts.")
                    .status(AlertStatus.OPEN)
                    .build();

            alertRepository.save(auditAlert);
        }

        auditLogService.logAction(null, auditorUsername, AuditAction.AI_AUDIT, "RationShop", shopId, null, "Executed AI Audit for shop " + shopDetails.getShopCode(), null);

        Map<String, Object> report = new HashMap<>();
        report.put("shopId", shopId);
        report.put("shopCode", shopDetails.getShopCode());
        report.put("shopName", shopDetails.getShopName());
        report.put("auditTimestamp", LocalDateTime.now());
        report.put("riskScore", shopDetails.getRiskScore());
        report.put("openAlertsCount", alerts.size());
        report.put("reportText", aiAnalysis);
        report.put("inventorySnapshot", inventory);
        report.put("alerts", alerts);

        return report;
    }
}
