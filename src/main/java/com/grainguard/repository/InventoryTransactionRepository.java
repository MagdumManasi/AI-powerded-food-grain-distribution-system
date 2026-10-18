package com.grainguard.repository;

import com.grainguard.entity.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    Optional<InventoryTransaction> findByTransactionCode(String transactionCode);
    List<InventoryTransaction> findByReferenceId(String referenceId);
}
