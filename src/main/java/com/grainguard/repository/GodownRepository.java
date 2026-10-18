package com.grainguard.repository;

import com.grainguard.entity.Godown;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GodownRepository extends JpaRepository<Godown, Long> {
    Optional<Godown> findByGodownCode(String godownCode);
    List<Godown> findByDistrict(String district);
}
