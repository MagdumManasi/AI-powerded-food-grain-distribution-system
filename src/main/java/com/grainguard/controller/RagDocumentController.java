package com.grainguard.controller;

import com.grainguard.ai.rag.RagService;
import com.grainguard.dto.ApiResponse;
import com.grainguard.entity.Document;
import com.grainguard.repository.DocumentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rag")
@Tag(name = "RAG Document Management", description = "Endpoints for uploading, indexing, and viewing PDS policy circulars and audit guidelines")
public class RagDocumentController {

    @Autowired
    private RagService ragService;

    @Autowired
    private DocumentRepository documentRepository;

    @GetMapping("/documents")
    @Operation(summary = "Get indexed policy documents")
    public ResponseEntity<ApiResponse<List<Document>>> getAllDocuments() {
        return ResponseEntity.ok(ApiResponse.success(documentRepository.findAll(), "Documents retrieved successfully"));
    }

    @PostMapping("/documents")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    @Operation(summary = "Upload and index policy document for RAG")
    public ResponseEntity<ApiResponse<Document>> ingestDocument(@RequestBody Map<String, String> request) {
        String title = request.get("title");
        String documentType = request.getOrDefault("documentType", "PDS_CIRCULAR");
        String source = request.getOrDefault("source", "Ministry of Consumer Affairs");
        String version = request.getOrDefault("version", "2024.1");
        String content = request.get("content");

        if (title == null || content == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Title and content are required"));
        }

        Document document = ragService.ingestDocument(title, title.toLowerCase().replace(" ", "_") + ".txt", "TXT", documentType, source, version, content, LocalDate.now());
        return ResponseEntity.ok(ApiResponse.success(document, "Document indexed for RAG vector search successfully"));
    }
}
