package com.grainguard.service;

import com.grainguard.dto.GrainDispatchDTO;
import com.grainguard.dto.GrainDispatchRequest;
import com.grainguard.entity.Godown;
import com.grainguard.entity.GrainDispatch;
import com.grainguard.entity.GrainType;
import com.grainguard.entity.RationShop;
import com.grainguard.entity.Transporter;
import com.grainguard.entity.enums.Enums.AuditAction;
import com.grainguard.entity.enums.Enums.DispatchStatus;
import com.grainguard.entity.enums.Enums.LocationType;
import com.grainguard.exception.Exceptions.DuplicateResourceException;
import com.grainguard.exception.Exceptions.ResourceNotFoundException;
import com.grainguard.repository.GodownRepository;
import com.grainguard.repository.GrainDispatchRepository;
import com.grainguard.repository.GrainTypeRepository;
import com.grainguard.repository.RationShopRepository;
import com.grainguard.repository.TransporterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DispatchService {

    @Autowired
    private GrainDispatchRepository dispatchRepository;

    @Autowired
    private GodownRepository godownRepository;

    @Autowired
    private RationShopRepository rationShopRepository;

    @Autowired
    private TransporterRepository transporterRepository;

    @Autowired
    private GrainTypeRepository grainTypeRepository;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private AuditLogService auditLogService;

    public List<GrainDispatchDTO> getAllDispatches() {
        return dispatchRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public GrainDispatchDTO getDispatchById(Long id) {
        GrainDispatch dispatch = dispatchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dispatch not found with id: " + id));
        return mapToDTO(dispatch);
    }

    @Transactional
    public GrainDispatchDTO createDispatch(GrainDispatchRequest request, String performedBy) {
        if (dispatchRepository.findByDispatchCode(request.getDispatchCode()).isPresent()) {
            throw new DuplicateResourceException("Dispatch code already exists: " + request.getDispatchCode());
        }

        // Deduct grain quantity from source Godown inventory
        inventoryService.removeStock(LocationType.GODOWN, request.getGodownId(), request.getGrainTypeId(), request.getQuantityDispatched(), request.getDispatchCode(), performedBy, "Godown grain dispatch");

        GrainDispatch dispatch = GrainDispatch.builder()
                .dispatchCode(request.getDispatchCode())
                .godownId(request.getGodownId())
                .rationShopId(request.getRationShopId())
                .transporterId(request.getTransporterId())
                .grainTypeId(request.getGrainTypeId())
                .quantityDispatched(request.getQuantityDispatched())
                .vehicleNumber(request.getVehicleNumber())
                .status(DispatchStatus.IN_TRANSIT)
                .createdBy(performedBy)
                .build();

        GrainDispatch saved = dispatchRepository.save(dispatch);

        auditLogService.logAction(null, performedBy, AuditAction.CREATE, "GrainDispatch", saved.getId(), null, "Created grain dispatch: " + saved.getDispatchCode(), null);

        return mapToDTO(saved);
    }

    public GrainDispatchDTO mapToDTO(GrainDispatch d) {
        String godownName = godownRepository.findById(d.getGodownId()).map(Godown::getName).orElse("Unknown Godown");
        String shopName = rationShopRepository.findById(d.getRationShopId()).map(RationShop::getShopName).orElse("Unknown Shop");
        String transporterName = d.getTransporterId() != null ? transporterRepository.findById(d.getTransporterId()).map(Transporter::getName).orElse(null) : null;
        String grainTypeName = grainTypeRepository.findById(d.getGrainTypeId()).map(GrainType::getName).orElse("Unknown Grain");

        return GrainDispatchDTO.builder()
                .id(d.getId())
                .dispatchCode(d.getDispatchCode())
                .godownId(d.getGodownId())
                .godownName(godownName)
                .rationShopId(d.getRationShopId())
                .shopName(shopName)
                .transporterId(d.getTransporterId())
                .transporterName(transporterName)
                .grainTypeId(d.getGrainTypeId())
                .grainTypeName(grainTypeName)
                .quantityDispatched(d.getQuantityDispatched())
                .dispatchDate(d.getDispatchDate())
                .vehicleNumber(d.getVehicleNumber())
                .status(d.getStatus())
                .createdBy(d.getCreatedBy())
                .build();
    }
}
