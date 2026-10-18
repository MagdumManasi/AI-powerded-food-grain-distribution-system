package com.grainguard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "document_chunks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentChunk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long documentId;

    private Integer chunkIndex;

    @Column(columnDefinition = "TEXT")
    private String content;

    private Integer pageNumber;

    @Column(columnDefinition = "TEXT")
    private String metadataJson;
}
