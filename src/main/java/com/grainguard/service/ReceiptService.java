package com.grainguard.service;

import com.grainguard.dto.GrainReceiptDTO;
import com.grainguard.dto.GrainReceiptRequest;
import com.grainguard.entity.GrainDispatch;
import com.grainguard.entity.GrainReceipt;
import com.grainguard.entity.enums.Enums.AuditAction;
import com.grainguard.entity.enums.Enums.DispatchStatus;
import com.grainguard.entity.enums.Enums.LocationType;
import com.grainguard.entity.enums.Enums.ReceiptStatus;
import com.grainguard.exception.Exceptions.ResourceNotFoundException;
import com.grainguard.repository.GrainDispatchRepository;
import com.grainguard.repository.GrainReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReceiptService {

    @Autowired
    private GrainReceiptRepository receiptRepository;

    @Autowired
    private GrainDispatchRepository dispatchRepository;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private AnomalyEngineService anomalyEngineService;

    @Autowired
    private AuditLogService auditLogService;

    public List<GrainReceiptDTO> getAllReceipts() {
        return receiptRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public GrainReceiptDTO getReceiptByDispatchId(Long dispatchId) {
        GrainReceipt receipt = receiptRepository.findByDispatchId(dispatchId)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found for dispatch ID: " + dispatchId));
        return mapToDTO(receipt);
    }

    @Transactional
    public GrainReceiptDTO recordReceipt(GrainReceiptRequest request, String performedBy) {
        GrainDispatch dispatch = dispatchRepository.findById(request.getDispatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Dispatch record not found: " + request.getDispatchId()));

        double dispatched = dispatch.getQuantityDispatched();
        double received = request.getQuantityReceived();
        double shortage = Math.max(0.0, dispatched - received);

        ReceiptStatus receiptStatus = shortage > 0.0 ? ReceiptStatus.DISCREPANCY_FLAGGED : ReceiptStatus.CONFIRMED;

        GrainReceipt receipt = GrainReceipt.builder()
                .dispatchId(dispatch.getId())
                .quantityReceived(received)
                .shortageQuantity(shortage)
                .receivedBy(performedBy)
                .remarks(request.getRemarks())
                .status(receiptStatus)
                .build();

        GrainReceipt savedReceipt = receiptRepository.save(receipt);

        // Add received stock to Ration Shop inventory
        inventoryService.addStock(LocationType.RATION_SHOP, dispatch.getRationShopId(), dispatch.getGrainTypeId(), received, "DISPATCH:" + dispatch.getDispatchCode(), performedBy, "Grain receipt confirmed");

        // Update dispatch status
        dispatch.setStatus(shortage > 0 ? DispatchStatus.PARTIALLY_RECEIVED : DispatchStatus.DELIVERED);
        dispatchRepository.save(dispatch);

        // Anomaly Engine Check for Stock Discrepancy
        if (shortage > 0) {
            anomalyEngineService.evaluateStockDiscrepancy(dispatch, savedReceipt);
        }

        auditLogService.logAction(null, performedBy, AuditAction.CREATE, "GrainReceipt", savedReceipt.getId(), null, "Recorded grain receipt for dispatch " + dispatch.getDispatchCode() + " (Received: " + received + " kg, Shortage: " + shortage + " kg)", null);

        return mapToDTO(savedReceipt);
    }

    public GrainReceiptDTO mapToDTO(GrainReceipt r) {
        GrainDispatch dispatch = dispatchRepository.findById(r.getDispatchId()).orElse(null);
        String dispatchCode = dispatch != null ? dispatch.getDispatchCode() : "N/A";
        Double dispatchedQty = dispatch != null ? dispatch.getQuantityDispatched() : 0.0;

        return GrainReceiptDTO.builder()
                .id(r.getId())
                .dispatchId(r.getDispatchId())
                .dispatchCode(dispatchCode)
                .quantityDispatched(dispatchedQty)
                .quantityReceived(r.getQuantityReceived())
                .shortageQuantity(r.getShortageQuantity())
                .receiptDate(r.getReceiptDate())
                .receivedBy(r.getReceivedBy())
                .remarks(r.getRemarks())
                .status(r.getStatus())
                .build();
    }
}
