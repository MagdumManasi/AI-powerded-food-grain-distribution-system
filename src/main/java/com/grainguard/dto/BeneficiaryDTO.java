package com.grainguard.dto;

import com.grainguard.entity.enums.Enums.BeneficiaryStatus;
import com.grainguard.entity.enums.Enums.RationCardType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeneficiaryDTO {
    private Long id;
    private String beneficiaryCode;
    private String name;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String district;
    private String state;
    private String rationCardNumber;
    private RationCardType rationCardType;
    private Integer familySize;
    private Long assignedShopId;
    private String shopName;
    private BeneficiaryStatus status;
    private List<FamilyMemberDTO> familyMembers;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
