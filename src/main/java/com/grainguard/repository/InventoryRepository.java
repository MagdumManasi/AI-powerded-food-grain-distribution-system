package com.grainguard.repository;

import com.grainguard.entity.Inventory;
import com.grainguard.entity.enums.Enums.LocationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByLocationTypeAndLocationId(LocationType locationType, Long locationId);
    Optional<Inventory> findByLocationTypeAndLocationIdAndGrainTypeId(LocationType locationType, Long locationId, Long grainTypeId);
    List<Inventory> findByQuantityLessThanEqual(Double threshold);
}
