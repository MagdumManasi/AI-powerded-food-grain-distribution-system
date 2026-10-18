package com.grainguard.ai.rag;

import com.grainguard.ai.service.GeminiService;
import com.grainguard.entity.Document;
import com.grainguard.entity.DocumentChunk;
import com.grainguard.repository.DocumentChunkRepository;
import com.grainguard.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RagService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private DocumentChunkRepository documentChunkRepository;

    @Autowired
    private GeminiService geminiService;

    @Transactional
    public Document ingestDocument(String title, String fileName, String fileType, String documentType, String source, String version, String fullText, LocalDate effectiveDate) {
        Document document = Document.builder()
                .title(title)
                .fileName(fileName)
                .fileType(fileType)
                .documentType(documentType)
                .source(source)
                .version(version)
                .effectiveDate(effectiveDate != null ? effectiveDate : LocalDate.now())
                .build();

        Document savedDoc = documentRepository.save(document);

        // Chunk text into 400-500 character blocks
        List<String> textChunks = splitIntoChunks(fullText, 450);
        int chunkIndex = 0;
        for (String chunkText : textChunks) {
            chunkIndex++;
            DocumentChunk chunk = DocumentChunk.builder()
                    .documentId(savedDoc.getId())
                    .chunkIndex(chunkIndex)
                    .content(chunkText)
                    .pageNumber((chunkIndex / 2) + 1)
                    .metadataJson(String.format("{\"documentTitle\":\"%s\",\"version\":\"%s\",\"documentType\":\"%s\"}", title, version, documentType))
                    .build();
            documentChunkRepository.save(chunk);
        }

        savedDoc.setTotalChunks(textChunks.size());
        return documentRepository.save(savedDoc);
    }

    public List<DocumentChunk> searchChunks(String query, int maxResults) {
        String[] keywords = query.toLowerCase().split("\\s+");
        List<DocumentChunk> allChunks = documentChunkRepository.findAll();

        // Score chunks based on keyword matching frequency & density
        Map<DocumentChunk, Integer> scoredChunks = new HashMap<>();
        for (DocumentChunk chunk : allChunks) {
            String contentLower = chunk.getContent().toLowerCase();
            int score = 0;
            for (String kw : keywords) {
                if (kw.length() > 2 && contentLower.contains(kw)) {
                    score += 5;
                }
            }
            if (score > 0) {
                scoredChunks.put(chunk, score);
            }
        }

        return scoredChunks.entrySet().stream()
                .sorted((e1, e2) -> Integer.compare(e2.getValue(), e1.getValue()))
                .limit(maxResults)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    public Map<String, Object> askGroundedPolicyQuestion(String question) {
        List<DocumentChunk> relevantChunks = searchChunks(question, 4);

        StringBuilder contextBuilder = new StringBuilder();
        List<Map<String, String>> citations = new ArrayList<>();

        for (DocumentChunk chunk : relevantChunks) {
            Document doc = documentRepository.findById(chunk.getDocumentId()).orElse(null);
            String docTitle = doc != null ? doc.getTitle() : "PDS Circular";
            String docSource = doc != null ? doc.getSource() : "Ministry of Consumer Affairs, Food & Public Distribution";

            contextBuilder.append(String.format("[Source: %s (Version %s, Page %d)]:\n%s\n\n",
                    docTitle, doc != null ? doc.getVersion() : "1.0", chunk.getPageNumber(), chunk.getContent()));

            citations.add(Map.of(
                    "documentTitle", docTitle,
                    "documentType", doc != null ? doc.getDocumentType() : "POLICY_DOCUMENT",
                    "pageNumber", String.valueOf(chunk.getPageNumber()),
                    "snippet", chunk.getContent().substring(0, Math.min(100, chunk.getContent().length())) + "..."
            ));
        }

        String systemPrompt = "You are GrainGuard AI Policy Assistant. Answer the user's question strictly grounded in the provided PDS circular context. " +
                "Do not hallucinate government rules. If the context does not contain sufficient information, state clearly what is known and what needs official verification.\n\n" +
                "PDS POLICY CONTEXT:\n" + contextBuilder.toString();

        String answer = geminiService.generateResponse(systemPrompt, question);

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("question", question);
        responseMap.put("answer", answer);
        responseMap.put("sources", citations);
        responseMap.put("chunksRetrieved", relevantChunks.size());

        return responseMap;
    }

    private List<String> splitIntoChunks(String text, int chunkSize) {
        List<String> chunks = new ArrayList<>();
        if (text == null || text.isEmpty()) return chunks;

        String[] paragraphs = text.split("\n\n");
        StringBuilder currentChunk = new StringBuilder();

        for (String para : paragraphs) {
            if (currentChunk.length() + para.length() > chunkSize && currentChunk.length() > 0) {
                chunks.add(currentChunk.toString().trim());
                currentChunk = new StringBuilder();
            }
            currentChunk.append(para).append("\n\n");
        }
        if (currentChunk.length() > 0) {
            chunks.add(currentChunk.toString().trim());
        }

        return chunks;
    }
}
