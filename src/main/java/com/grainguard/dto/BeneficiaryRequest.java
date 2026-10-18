package com.grainguard.dto;

import com.grainguard.entity.enums.Enums.BeneficiaryStatus;
import com.grainguard.entity.enums.Enums.RationCardType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class BeneficiaryRequest {

    @NotBlank(message = "Beneficiary code is required")
    private String beneficiaryCode;

    @NotBlank(message = "Name is required")
    private String name;

    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String district;
    private String state;

    @NotBlank(message = "Ration card number is required")
    private String rationCardNumber;

    @NotNull(message = "Ration card type is required")
    private RationCardType rationCardType;

    private Integer familySize;
    private Long assignedShopId;
    private BeneficiaryStatus status;

    private List<FamilyMemberDTO> familyMembers;
}
