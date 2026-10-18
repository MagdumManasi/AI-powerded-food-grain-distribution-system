package com.grainguard.service;

import com.grainguard.dto.GodownDTO;
import com.grainguard.dto.GodownRequest;
import com.grainguard.entity.Godown;
import com.grainguard.entity.enums.Enums.AuditAction;
import com.grainguard.exception.Exceptions.DuplicateResourceException;
import com.grainguard.exception.Exceptions.ResourceNotFoundException;
import com.grainguard.repository.GodownRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GodownService {

    @Autowired
    private GodownRepository godownRepository;

    @Autowired
    private AuditLogService auditLogService;

    public List<GodownDTO> getAllGodowns() {
        return godownRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public GodownDTO getGodownById(Long id) {
        Godown godown = godownRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Godown not found with id: " + id));
        return mapToDTO(godown);
    }

    @Transactional
    public GodownDTO createGodown(GodownRequest request, String performedBy) {
        if (godownRepository.findByGodownCode(request.getGodownCode()).isPresent()) {
            throw new DuplicateResourceException("Godown code already exists: " + request.getGodownCode());
        }

        Godown godown = Godown.builder()
                .godownCode(request.getGodownCode())
                .name(request.getName())
                .location(request.getLocation())
                .district(request.getDistrict())
                .capacity(request.getCapacity() != null ? request.getCapacity() : 100000.0)
                .currentStatus(request.getCurrentStatus() != null ? request.getCurrentStatus() : "ACTIVE")
                .build();

        Godown saved = godownRepository.save(godown);
        auditLogService.logAction(null, performedBy, AuditAction.CREATE, "Godown", saved.getId(), null, "Created godown: " + saved.getGodownCode(), null);
        return mapToDTO(saved);
    }

    public GodownDTO mapToDTO(Godown g) {
        return GodownDTO.builder()
                .id(g.getId())
                .godownCode(g.getGodownCode())
                .name(g.getName())
                .location(g.getLocation())
                .district(g.getDistrict())
                .capacity(g.getCapacity())
                .currentStatus(g.getCurrentStatus())
                .createdAt(g.getCreatedAt())
                .build();
    }
}
