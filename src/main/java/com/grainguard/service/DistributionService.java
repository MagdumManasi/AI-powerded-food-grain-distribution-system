package com.grainguard.service;

import com.grainguard.dto.DistributionRequest;
import com.grainguard.dto.DistributionTransactionDTO;
import com.grainguard.entity.Beneficiary;
import com.grainguard.entity.DistributionTransaction;
import com.grainguard.entity.GrainType;
import com.grainguard.entity.RationShop;
import com.grainguard.entity.enums.Enums.AuditAction;
import com.grainguard.entity.enums.Enums.LocationType;
import com.grainguard.exception.Exceptions.DuplicateResourceException;
import com.grainguard.exception.Exceptions.ResourceNotFoundException;
import com.grainguard.exception.Exceptions.ValidationException;
import com.grainguard.repository.BeneficiaryRepository;
import com.grainguard.repository.DistributionTransactionRepository;
import com.grainguard.repository.GrainTypeRepository;
import com.grainguard.repository.RationShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DistributionService {

    @Autowired
    private DistributionTransactionRepository distributionTransactionRepository;

    @Autowired
    private BeneficiaryRepository beneficiaryRepository;

    @Autowired
    private RationShopRepository rationShopRepository;

    @Autowired
    private GrainTypeRepository grainTypeRepository;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private EntitlementService entitlementService;

    @Autowired
    private AnomalyEngineService anomalyEngineService;

    @Autowired
    private AuditLogService auditLogService;

    public List<DistributionTransactionDTO> getAllDistributions() {
        return distributionTransactionRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DistributionTransactionDTO> getDistributionsByShop(Long shopId) {
        return distributionTransactionRepository.findByRationShopId(shopId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DistributionTransactionDTO> getDistributionsByBeneficiary(Long beneficiaryId) {
        return distributionTransactionRepository.findByBeneficiaryId(beneficiaryId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public DistributionTransactionDTO recordDistribution(DistributionRequest request, String operatorId) {
        if (distributionTransactionRepository.findByTransactionCode(request.getTransactionCode()).isPresent()) {
            throw new DuplicateResourceException("Transaction code already exists: " + request.getTransactionCode());
        }

        Beneficiary beneficiary = beneficiaryRepository.findById(request.getBeneficiaryId())
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found: " + request.getBeneficiaryId()));

        // Validate entitlement limits
        Double maxEntitled = entitlementService.calculateBeneficiaryEntitlement(beneficiary.getId(), request.getGrainTypeId());
        if (request.getQuantity() > maxEntitled * 1.5) {
            throw new ValidationException("Requested distribution quantity (" + request.getQuantity() + " KG) significantly exceeds entitlement limit (" + maxEntitled + " KG)");
        }

        // Deduct stock from shop (throws InsufficientStockException if stock < requested quantity)
        inventoryService.removeStock(LocationType.RATION_SHOP, request.getRationShopId(), request.getGrainTypeId(), request.getQuantity(), request.getTransactionCode(), operatorId, "Beneficiary grain distribution");

        DistributionTransaction tx = DistributionTransaction.builder()
                .transactionCode(request.getTransactionCode())
                .beneficiaryId(request.getBeneficiaryId())
                .rationShopId(request.getRationShopId())
                .grainTypeId(request.getGrainTypeId())
                .quantity(request.getQuantity())
                .operatorId(operatorId)
                .status("COMPLETED")
                .remarks(request.getRemarks())
                .build();

        DistributionTransaction saved = distributionTransactionRepository.save(tx);

        // Check for distribution anomaly baseline deviation
        anomalyEngineService.evaluateDistributionDeviation(request.getRationShopId());

        auditLogService.logAction(null, operatorId, AuditAction.DISTRIBUTION, "DistributionTransaction", saved.getId(), null, "Distributed " + saved.getQuantity() + " kg to beneficiary " + beneficiary.getBeneficiaryCode(), null);

        return mapToDTO(saved);
    }

    public DistributionTransactionDTO mapToDTO(DistributionTransaction dt) {
        Beneficiary b = beneficiaryRepository.findById(dt.getBeneficiaryId()).orElse(null);
        String beneficiaryName = b != null ? b.getName() : "Unknown";
        String rationCard = b != null ? b.getRationCardNumber() : "N/A";
        String shopName = rationShopRepository.findById(dt.getRationShopId()).map(RationShop::getShopName).orElse("Unknown Shop");
        String grainName = grainTypeRepository.findById(dt.getGrainTypeId()).map(GrainType::getName).orElse("Unknown");

        return DistributionTransactionDTO.builder()
                .id(dt.getId())
                .transactionCode(dt.getTransactionCode())
                .beneficiaryId(dt.getBeneficiaryId())
                .beneficiaryName(beneficiaryName)
                .rationCardNumber(rationCard)
                .rationShopId(dt.getRationShopId())
                .shopName(shopName)
                .grainTypeId(dt.getGrainTypeId())
                .grainTypeName(grainName)
                .quantity(dt.getQuantity())
                .distributionDate(dt.getDistributionDate())
                .operatorId(dt.getOperatorId())
                .status(dt.getStatus())
                .remarks(dt.getRemarks())
                .build();
    }
}
