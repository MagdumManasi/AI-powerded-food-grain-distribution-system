package com.grainguard.service;

import com.grainguard.dto.BeneficiaryDTO;
import com.grainguard.dto.BeneficiaryRequest;
import com.grainguard.dto.FamilyMemberDTO;
import com.grainguard.entity.Beneficiary;
import com.grainguard.entity.FamilyMember;
import com.grainguard.entity.RationShop;
import com.grainguard.entity.enums.Enums.AuditAction;
import com.grainguard.entity.enums.Enums.BeneficiaryStatus;
import com.grainguard.exception.Exceptions.DuplicateResourceException;
import com.grainguard.exception.Exceptions.ResourceNotFoundException;
import com.grainguard.repository.BeneficiaryRepository;
import com.grainguard.repository.FamilyMemberRepository;
import com.grainguard.repository.RationShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BeneficiaryService {

    @Autowired
    private BeneficiaryRepository beneficiaryRepository;

    @Autowired
    private FamilyMemberRepository familyMemberRepository;

    @Autowired
    private RationShopRepository rationShopRepository;

    @Autowired
    private AuditLogService auditLogService;

    public List<BeneficiaryDTO> getAllBeneficiaries() {
        return beneficiaryRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public BeneficiaryDTO getBeneficiaryById(Long id) {
        Beneficiary beneficiary = beneficiaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found with id: " + id));
        return mapToDTO(beneficiary);
    }

    public BeneficiaryDTO getBeneficiaryByCode(String code) {
        Beneficiary beneficiary = beneficiaryRepository.findByBeneficiaryCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found with code: " + code));
        return mapToDTO(beneficiary);
    }

    public List<BeneficiaryDTO> getBeneficiariesByShop(Long shopId) {
        return beneficiaryRepository.findByAssignedShopId(shopId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BeneficiaryDTO createBeneficiary(BeneficiaryRequest request, String performedBy) {
        if (beneficiaryRepository.findByBeneficiaryCode(request.getBeneficiaryCode()).isPresent()) {
            throw new DuplicateResourceException("Beneficiary code already exists: " + request.getBeneficiaryCode());
        }

        if (beneficiaryRepository.findByRationCardNumber(request.getRationCardNumber()).isPresent()) {
            throw new DuplicateResourceException("Ration card number already exists: " + request.getRationCardNumber());
        }

        Beneficiary beneficiary = Beneficiary.builder()
                .beneficiaryCode(request.getBeneficiaryCode())
                .name(request.getName())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .address(request.getAddress())
                .district(request.getDistrict())
                .state(request.getState())
                .rationCardNumber(request.getRationCardNumber())
                .rationCardType(request.getRationCardType())
                .familySize(request.getFamilySize() != null ? request.getFamilySize() : 1)
                .assignedShopId(request.getAssignedShopId())
                .status(request.getStatus() != null ? request.getStatus() : BeneficiaryStatus.ACTIVE)
                .build();

        Beneficiary saved = beneficiaryRepository.save(beneficiary);

        if (request.getFamilyMembers() != null) {
            for (FamilyMemberDTO fmDTO : request.getFamilyMembers()) {
                FamilyMember fm = FamilyMember.builder()
                        .beneficiaryId(saved.getId())
                        .name(fmDTO.getName())
                        .dateOfBirth(fmDTO.getDateOfBirth())
                        .relationship(fmDTO.getRelationship())
                        .gender(fmDTO.getGender())
                        .status("ACTIVE")
                        .build();
                familyMemberRepository.save(fm);
            }
        }

        auditLogService.logAction(null, performedBy, AuditAction.CREATE, "Beneficiary", saved.getId(), null, "Created beneficiary: " + saved.getBeneficiaryCode(), null);

        return mapToDTO(saved);
    }

    @Transactional
    public BeneficiaryDTO updateBeneficiary(Long id, BeneficiaryRequest request, String performedBy) {
        Beneficiary beneficiary = beneficiaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found with id: " + id));

        beneficiary.setName(request.getName());
        beneficiary.setAddress(request.getAddress());
        beneficiary.setDistrict(request.getDistrict());
        beneficiary.setState(request.getState());
        beneficiary.setFamilySize(request.getFamilySize());
        beneficiary.setAssignedShopId(request.getAssignedShopId());
        if (request.getStatus() != null) {
            beneficiary.setStatus(request.getStatus());
        }

        Beneficiary updated = beneficiaryRepository.save(beneficiary);

        auditLogService.logAction(null, performedBy, AuditAction.UPDATE, "Beneficiary", updated.getId(), null, "Updated beneficiary: " + updated.getBeneficiaryCode(), null);

        return mapToDTO(updated);
    }

    @Transactional
    public void deleteBeneficiary(Long id, String performedBy) {
        Beneficiary beneficiary = beneficiaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found with id: " + id));
        beneficiary.setStatus(BeneficiaryStatus.INACTIVE);
        beneficiaryRepository.save(beneficiary);

        auditLogService.logAction(null, performedBy, AuditAction.DELETE, "Beneficiary", id, null, "Deactivated beneficiary", null);
    }

    public BeneficiaryDTO mapToDTO(Beneficiary b) {
        String shopName = null;
        if (b.getAssignedShopId() != null) {
            shopName = rationShopRepository.findById(b.getAssignedShopId())
                    .map(RationShop::getShopName)
                    .orElse(null);
        }

        List<FamilyMemberDTO> members = familyMemberRepository.findByBeneficiaryId(b.getId()).stream()
                .map(m -> FamilyMemberDTO.builder()
                        .id(m.getId())
                        .beneficiaryId(m.getBeneficiaryId())
                        .name(m.getName())
                        .dateOfBirth(m.getDateOfBirth())
                        .relationship(m.getRelationship())
                        .gender(m.getGender())
                        .status(m.getStatus())
                        .build())
                .collect(Collectors.toList());

        return BeneficiaryDTO.builder()
                .id(b.getId())
                .beneficiaryCode(b.getBeneficiaryCode())
                .name(b.getName())
                .dateOfBirth(b.getDateOfBirth())
                .gender(b.getGender())
                .address(b.getAddress())
                .district(b.getDistrict())
                .state(b.getState())
                .rationCardNumber(b.getRationCardNumber())
                .rationCardType(b.getRationCardType())
                .familySize(b.getFamilySize())
                .assignedShopId(b.getAssignedShopId())
                .shopName(shopName)
                .status(b.getStatus())
                .familyMembers(members)
                .createdAt(b.getCreatedAt())
                .updatedAt(b.getUpdatedAt())
                .build();
    }
}
