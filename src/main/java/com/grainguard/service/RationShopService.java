package com.grainguard.service;

import com.grainguard.dto.RationShopDTO;
import com.grainguard.dto.RationShopRequest;
import com.grainguard.entity.RationShop;
import com.grainguard.entity.ShopRiskProfile;
import com.grainguard.entity.enums.Enums.AuditAction;
import com.grainguard.entity.enums.Enums.ShopStatus;
import com.grainguard.exception.Exceptions.DuplicateResourceException;
import com.grainguard.exception.Exceptions.ResourceNotFoundException;
import com.grainguard.repository.BeneficiaryRepository;
import com.grainguard.repository.RationShopRepository;
import com.grainguard.repository.ShopRiskProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RationShopService {

    @Autowired
    private RationShopRepository rationShopRepository;

    @Autowired
    private BeneficiaryRepository beneficiaryRepository;

    @Autowired
    private ShopRiskProfileRepository shopRiskProfileRepository;

    @Autowired
    private AuditLogService auditLogService;

    public List<RationShopDTO> getAllShops() {
        return rationShopRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public RationShopDTO getShopById(Long id) {
        RationShop shop = rationShopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ration shop not found with id: " + id));
        return mapToDTO(shop);
    }

    public RationShopDTO getShopByCode(String code) {
        RationShop shop = rationShopRepository.findByShopCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Ration shop not found with code: " + code));
        return mapToDTO(shop);
    }

    @Transactional
    public RationShopDTO createShop(RationShopRequest request, String performedBy) {
        if (rationShopRepository.findByShopCode(request.getShopCode()).isPresent()) {
            throw new DuplicateResourceException("Shop code already exists: " + request.getShopCode());
        }

        RationShop shop = RationShop.builder()
                .shopCode(request.getShopCode())
                .shopName(request.getShopName())
                .ownerName(request.getOwnerName())
                .address(request.getAddress())
                .district(request.getDistrict())
                .state(request.getState())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .capacity(request.getCapacity() != null ? request.getCapacity() : 50000.0)
                .currentStatus(request.getCurrentStatus() != null ? request.getCurrentStatus() : ShopStatus.ACTIVE)
                .assignedOfficer(request.getAssignedOfficer())
                .build();

        RationShop saved = rationShopRepository.save(shop);

        // Initialize ShopRiskProfile
        ShopRiskProfile riskProfile = ShopRiskProfile.builder()
                .shopId(saved.getId())
                .riskScore(0.0)
                .stockRisk(0.0)
                .distributionRisk(0.0)
                .transactionRisk(0.0)
                .beneficiaryRisk(0.0)
                .build();
        shopRiskProfileRepository.save(riskProfile);

        auditLogService.logAction(null, performedBy, AuditAction.CREATE, "RationShop", saved.getId(), null, "Created Ration Shop: " + saved.getShopCode(), null);

        return mapToDTO(saved);
    }

    @Transactional
    public RationShopDTO updateShop(Long id, RationShopRequest request, String performedBy) {
        RationShop shop = rationShopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ration shop not found with id: " + id));

        shop.setShopName(request.getShopName());
        shop.setOwnerName(request.getOwnerName());
        shop.setAddress(request.getAddress());
        shop.setDistrict(request.getDistrict());
        shop.setState(request.getState());
        shop.setLatitude(request.getLatitude());
        shop.setLongitude(request.getLongitude());
        shop.setCapacity(request.getCapacity());
        if (request.getCurrentStatus() != null) {
            shop.setCurrentStatus(request.getCurrentStatus());
        }
        shop.setAssignedOfficer(request.getAssignedOfficer());

        RationShop updated = rationShopRepository.save(shop);

        auditLogService.logAction(null, performedBy, AuditAction.UPDATE, "RationShop", updated.getId(), null, "Updated Ration Shop: " + updated.getShopCode(), null);

        return mapToDTO(updated);
    }

    public RationShopDTO mapToDTO(RationShop shop) {
        int beneficiaryCount = beneficiaryRepository.findByAssignedShopId(shop.getId()).size();
        Double riskScore = shopRiskProfileRepository.findByShopId(shop.getId())
                .map(ShopRiskProfile::getRiskScore)
                .orElse(0.0);

        return RationShopDTO.builder()
                .id(shop.getId())
                .shopCode(shop.getShopCode())
                .shopName(shop.getShopName())
                .ownerName(shop.getOwnerName())
                .address(shop.getAddress())
                .district(shop.getDistrict())
                .state(shop.getState())
                .latitude(shop.getLatitude())
                .longitude(shop.getLongitude())
                .capacity(shop.getCapacity())
                .currentStatus(shop.getCurrentStatus())
                .assignedOfficer(shop.getAssignedOfficer())
                .beneficiaryCount(beneficiaryCount)
                .riskScore(riskScore)
                .createdAt(shop.getCreatedAt())
                .updatedAt(shop.getUpdatedAt())
                .build();
    }
}
