package com.grainguard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyMemberDTO {
    private Long id;
    private Long beneficiaryId;
    private String name;
    private LocalDate dateOfBirth;
    private String relationship;
    private String gender;
    private String status;
}
