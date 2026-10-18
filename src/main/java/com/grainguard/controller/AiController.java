package com.grainguard.controller;

import com.grainguard.ai.agent.AiAuditAgentService;
import com.grainguard.ai.agent.DemandPlanningAgentService;
import com.grainguard.ai.rag.RagService;
import com.grainguard.dto.ApiResponse;
import com.grainguard.entity.ShopRiskProfile;
import com.grainguard.repository.ShopRiskProfileRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@Tag(name = "AI Intelligence & Agents", description = "Endpoints for AI Assistant, RAG Policy QA, AI Audit Agent, and Demand Planning Agent")
public class AiController {

    @Autowired
    private RagService ragService;

    @Autowired
    private AiAuditAgentService aiAuditAgentService;

    @Autowired
    private DemandPlanningAgentService demandPlanningAgentService;

    @Autowired
    private ShopRiskProfileRepository shopRiskProfileRepository;

    @PostMapping("/ask")
    @Operation(summary = "Ask AI Assistant", description = "RAG policy QA and intelligent query assistant with document citations")
    public ResponseEntity<ApiResponse<Map<String, Object>>> askAi(@RequestBody Map<String, String> request) {
        String question = request.get("question");
        if (question == null || question.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Question prompt is required"));
        }
        Map<String, Object> result = ragService.askGroundedPolicyQuestion(question);
        return ResponseEntity.ok(ApiResponse.success(result, "AI response generated successfully"));
    }

    @PostMapping("/audit/shop/{shopId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER', 'AUDITOR')")
    @Operation(summary = "Run AI Shop Audit Agent", description = "Executes automated evidence-based audit analysis for a Ration Shop")
    public ResponseEntity<ApiResponse<Map<String, Object>>> runShopAudit(@PathVariable Long shopId, Authentication authentication) {
        Map<String, Object> auditReport = aiAuditAgentService.runShopAudit(shopId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(auditReport, "AI Shop Audit completed successfully"));
    }

    @GetMapping("/risk/shop/{shopId}")
    @Operation(summary = "Get Shop Risk Profile", description = "Retrieves risk indicators and contributing signals for a Ration Shop")
    public ResponseEntity<ApiResponse<ShopRiskProfile>> getShopRiskProfile(@PathVariable Long shopId) {
        ShopRiskProfile profile = shopRiskProfileRepository.findByShopId(shopId).orElse(null);
        return ResponseEntity.ok(ApiResponse.success(profile, "Shop risk profile retrieved"));
    }

    @PostMapping("/demand/recommendation")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    @Operation(summary = "Run Demand Planning Agent", description = "Generates explainable grain allocation recommendations for upcoming period")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDemandRecommendation(@RequestBody Map<String, Long> request, Authentication authentication) {
        Long shopId = request.get("shopId");
        if (shopId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("shopId is required"));
        }
        Map<String, Object> recommendation = demandPlanningAgentService.generateDemandRecommendation(shopId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(recommendation, "Demand allocation recommendation generated"));
    }
}
