package com.grainguard.service;

import com.grainguard.dto.InventoryDTO;
import com.grainguard.dto.InventoryTransferRequest;
import com.grainguard.entity.Godown;
import com.grainguard.entity.GrainType;
import com.grainguard.entity.Inventory;
import com.grainguard.entity.InventoryTransaction;
import com.grainguard.entity.RationShop;
import com.grainguard.entity.enums.Enums.AuditAction;
import com.grainguard.entity.enums.Enums.LocationType;
import com.grainguard.entity.enums.Enums.TransactionType;
import com.grainguard.exception.Exceptions.InsufficientStockException;
import com.grainguard.exception.Exceptions.ResourceNotFoundException;
import com.grainguard.repository.GodownRepository;
import com.grainguard.repository.GrainTypeRepository;
import com.grainguard.repository.InventoryRepository;
import com.grainguard.repository.InventoryTransactionRepository;
import com.grainguard.repository.RationShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private InventoryTransactionRepository inventoryTransactionRepository;

    @Autowired
    private GrainTypeRepository grainTypeRepository;

    @Autowired
    private RationShopRepository rationShopRepository;

    @Autowired
    private GodownRepository godownRepository;

    @Autowired
    private AuditLogService auditLogService;

    public List<InventoryDTO> getAllInventories() {
        return inventoryRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<InventoryDTO> getInventoryByLocation(LocationType locationType, Long locationId) {
        return inventoryRepository.findByLocationTypeAndLocationId(locationType, locationId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public InventoryDTO addStock(LocationType locationType, Long locationId, Long grainTypeId, Double quantity, String referenceId, String performedBy, String remarks) {
        Inventory inventory = inventoryRepository.findByLocationTypeAndLocationIdAndGrainTypeId(locationType, locationId, grainTypeId)
                .orElseGet(() -> Inventory.builder()
                        .locationType(locationType)
                        .locationId(locationId)
                        .grainTypeId(grainTypeId)
                        .quantity(0.0)
                        .minimumThreshold(100.0)
                        .build());

        inventory.setQuantity(inventory.getQuantity() + quantity);
        Inventory saved = inventoryRepository.save(inventory);

        InventoryTransaction tx = InventoryTransaction.builder()
                .transactionCode("TX-ADD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .grainTypeId(grainTypeId)
                .sourceLocation("EXTERNAL_SUPPLY")
                .destinationLocation(locationType.name() + ":" + locationId)
                .quantity(quantity)
                .transactionType(TransactionType.RECEIPT)
                .referenceId(referenceId)
                .performedBy(performedBy)
                .remarks(remarks)
                .build();
        inventoryTransactionRepository.save(tx);

        auditLogService.logAction(null, performedBy, AuditAction.STOCK_TRANSFER, "Inventory", saved.getId(), null, "Added " + quantity + " kg stock to " + locationType + " " + locationId, null);

        return mapToDTO(saved);
    }

    @Transactional
    public InventoryDTO removeStock(LocationType locationType, Long locationId, Long grainTypeId, Double quantity, String referenceId, String performedBy, String remarks) {
        Inventory inventory = inventoryRepository.findByLocationTypeAndLocationIdAndGrainTypeId(locationType, locationId, grainTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("No inventory record found for location " + locationType + " ID: " + locationId));

        if (inventory.getQuantity() < quantity) {
            throw new InsufficientStockException("Insufficient stock! Available: " + inventory.getQuantity() + " KG, Requested: " + quantity + " KG");
        }

        inventory.setQuantity(inventory.getQuantity() - quantity);
        Inventory saved = inventoryRepository.save(inventory);

        InventoryTransaction tx = InventoryTransaction.builder()
                .transactionCode("TX-REM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .grainTypeId(grainTypeId)
                .sourceLocation(locationType.name() + ":" + locationId)
                .destinationLocation("DISPATCH_OR_DISTRIBUTION")
                .quantity(quantity)
                .transactionType(TransactionType.DISPATCH)
                .referenceId(referenceId)
                .performedBy(performedBy)
                .remarks(remarks)
                .build();
        inventoryTransactionRepository.save(tx);

        auditLogService.logAction(null, performedBy, AuditAction.STOCK_TRANSFER, "Inventory", saved.getId(), null, "Removed " + quantity + " kg stock from " + locationType + " " + locationId, null);

        return mapToDTO(saved);
    }

    @Transactional
    public void transferStock(InventoryTransferRequest request, String performedBy) {
        removeStock(request.getSourceLocationType(), request.getSourceLocationId(), request.getGrainTypeId(), request.getQuantity(), "TRANSFER", performedBy, request.getRemarks());
        addStock(request.getDestinationLocationType(), request.getDestinationLocationId(), request.getGrainTypeId(), request.getQuantity(), "TRANSFER", performedBy, request.getRemarks());
    }

    public InventoryDTO mapToDTO(Inventory inv) {
        String grainName = grainTypeRepository.findById(inv.getGrainTypeId())
                .map(GrainType::getName)
                .orElse("UNKNOWN");

        String locationName = "Unknown";
        if (inv.getLocationType() == LocationType.GODOWN) {
            locationName = godownRepository.findById(inv.getLocationId())
                    .map(Godown::getName)
                    .orElse("Godown #" + inv.getLocationId());
        } else if (inv.getLocationType() == LocationType.RATION_SHOP) {
            locationName = rationShopRepository.findById(inv.getLocationId())
                    .map(RationShop::getShopName)
                    .orElse("Shop #" + inv.getLocationId());
        }

        return InventoryDTO.builder()
                .id(inv.getId())
                .locationType(inv.getLocationType())
                .locationId(inv.getLocationId())
                .locationName(locationName)
                .grainTypeId(inv.getGrainTypeId())
                .grainTypeName(grainName)
                .quantity(inv.getQuantity())
                .minimumThreshold(inv.getMinimumThreshold())
                .lowStock(inv.getQuantity() <= inv.getMinimumThreshold())
                .lastUpdated(inv.getLastUpdated())
                .build();
    }
}
