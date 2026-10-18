package com.grainguard.repository;

import com.grainguard.entity.Beneficiary;
import com.grainguard.entity.enums.Enums.BeneficiaryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {
    Optional<Beneficiary> findByBeneficiaryCode(String beneficiaryCode);
    Optional<Beneficiary> findByRationCardNumber(String rationCardNumber);
    List<Beneficiary> findByAssignedShopId(Long shopId);
    List<Beneficiary> findByDistrict(String district);
    List<Beneficiary> findByStatus(BeneficiaryStatus status);
    List<Beneficiary> findByNameContainingIgnoreCase(String name);
}
