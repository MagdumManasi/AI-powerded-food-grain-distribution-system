package com.grainguard.repository;

import com.grainguard.entity.ShopRiskProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShopRiskProfileRepository extends JpaRepository<ShopRiskProfile, Long> {
    Optional<ShopRiskProfile> findByShopId(Long shopId);
}
