package com.grainguard.repository;

import com.grainguard.entity.EntitlementRule;
import com.grainguard.entity.enums.Enums.RationCardType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EntitlementRuleRepository extends JpaRepository<EntitlementRule, Long> {
    List<EntitlementRule> findByRationCardTypeAndActiveTrue(RationCardType cardType);
    Optional<EntitlementRule> findByRationCardTypeAndGrainTypeIdAndActiveTrue(RationCardType cardType, Long grainTypeId);
}
