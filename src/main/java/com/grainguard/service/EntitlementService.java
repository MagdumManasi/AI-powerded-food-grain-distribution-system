package com.grainguard.service;

import com.grainguard.entity.Beneficiary;
import com.grainguard.entity.EntitlementRule;
import com.grainguard.entity.enums.Enums.RationCardType;
import com.grainguard.exception.Exceptions.ResourceNotFoundException;
import com.grainguard.repository.BeneficiaryRepository;
import com.grainguard.repository.EntitlementRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EntitlementService {

    @Autowired
    private EntitlementRuleRepository entitlementRuleRepository;

    @Autowired
    private BeneficiaryRepository beneficiaryRepository;

    public List<EntitlementRule> getAllActiveRules() {
        return entitlementRuleRepository.findAll().stream()
                .filter(EntitlementRule::isActive)
                .toList();
    }

    public Double calculateBeneficiaryEntitlement(Long beneficiaryId, Long grainTypeId) {
        Beneficiary beneficiary = beneficiaryRepository.findById(beneficiaryId)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found with id: " + beneficiaryId));

        RationCardType cardType = beneficiary.getRationCardType();

        EntitlementRule rule = entitlementRuleRepository.findByRationCardTypeAndGrainTypeIdAndActiveTrue(cardType, grainTypeId)
                .orElse(null);

        if (rule == null) {
            // Default fallbacks based on PDS policy if rule isn't in DB yet
            if (cardType == RationCardType.AAY) {
                return 35.0; // 35 kg fixed per family
            } else if (cardType == RationCardType.PHH) {
                return 5.0 * Math.max(1, beneficiary.getFamilySize()); // 5 kg per member
            } else {
                return 2.0 * Math.max(1, beneficiary.getFamilySize()); // NPHH standard
            }
        }

        if (cardType == RationCardType.AAY) {
            return rule.getQuantityPerPerson();
        } else {
            return rule.getQuantityPerPerson() * Math.max(1, beneficiary.getFamilySize());
        }
    }
}
