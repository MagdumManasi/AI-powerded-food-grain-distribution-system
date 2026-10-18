package com.grainguard.repository;

import com.grainguard.entity.GrainReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GrainReceiptRepository extends JpaRepository<GrainReceipt, Long> {
    Optional<GrainReceipt> findByDispatchId(Long dispatchId);
    List<GrainReceipt> findByShortageQuantityGreaterThan(Double shortage);
}
