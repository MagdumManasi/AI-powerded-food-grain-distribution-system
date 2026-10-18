package com.grainguard.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String fileName;
    private String fileType;
    private String documentType; // PDS_CIRCULAR, ALLOCATION_POLICY, INSPECTION_GUIDELINE, AUDIT_MANUAL
    private String source;
    private String version;

    private LocalDateTime uploadDate;
    private LocalDate effectiveDate;

    @Builder.Default
    private Integer totalChunks = 0;

    @PrePersist
    protected void onCreate() {
        if (uploadDate == null) {
            uploadDate = LocalDateTime.now();
        }
    }
}
