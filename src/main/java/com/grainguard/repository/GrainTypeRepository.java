package com.grainguard.repository;

import com.grainguard.entity.GrainType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GrainTypeRepository extends JpaRepository<GrainType, Long> {
    Optional<GrainType> findByName(String name);
}
