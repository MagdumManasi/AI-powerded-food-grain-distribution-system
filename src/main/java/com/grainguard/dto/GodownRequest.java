package com.grainguard.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GodownRequest {

    @NotBlank(message = "Godown code is required")
    private String godownCode;

    @NotBlank(message = "Name is required")
    private String name;

    private String location;
    private String district;
    private Double capacity;
    private String currentStatus;
}
