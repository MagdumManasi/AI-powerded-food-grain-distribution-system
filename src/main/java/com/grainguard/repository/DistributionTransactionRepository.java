package com.grainguard.repository;

import com.grainguard.entity.DistributionTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DistributionTransactionRepository extends JpaRepository<DistributionTransaction, Long> {
    Optional<DistributionTransaction> findByTransactionCode(String transactionCode);
    List<DistributionTransaction> findByBeneficiaryId(Long beneficiaryId);
    List<DistributionTransaction> findByRationShopId(Long rationShopId);
    List<DistributionTransaction> findByRationShopIdAndDistributionDateBetween(Long rationShopId, LocalDateTime start, LocalDateTime end);
}
