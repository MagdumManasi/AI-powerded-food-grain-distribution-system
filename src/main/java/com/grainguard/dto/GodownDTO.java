package com.grainguard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GodownDTO {
    private Long id;
    private String godownCode;
    private String name;
    private String location;
    private String district;
    private Double capacity;
    private String currentStatus;
    private LocalDateTime createdAt;
}
