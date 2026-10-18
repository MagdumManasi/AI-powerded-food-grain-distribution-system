package com.grainguard.repository;

import com.grainguard.entity.RationShop;
import com.grainguard.entity.enums.Enums.ShopStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RationShopRepository extends JpaRepository<RationShop, Long> {
    Optional<RationShop> findByShopCode(String shopCode);
    List<RationShop> findByDistrict(String district);
    List<RationShop> findByCurrentStatus(ShopStatus status);
}
