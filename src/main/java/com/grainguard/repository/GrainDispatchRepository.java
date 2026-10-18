package com.grainguard.repository;

import com.grainguard.entity.GrainDispatch;
import com.grainguard.entity.enums.Enums.DispatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GrainDispatchRepository extends JpaRepository<GrainDispatch, Long> {
    Optional<GrainDispatch> findByDispatchCode(String dispatchCode);
    List<GrainDispatch> findByGodownId(Long godownId);
    List<GrainDispatch> findByRationShopId(Long rationShopId);
    List<GrainDispatch> findByStatus(DispatchStatus status);
}
