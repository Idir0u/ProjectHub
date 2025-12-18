package com.projecthub.controller;

import com.projecthub.dto.CreateTagRequest;
import com.projecthub.dto.TagDTO;
import com.projecthub.security.UserDetailsImpl;
import com.projecthub.service.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for tag management.
 */
@RestController
@RequestMapping("/projects/{projectId}/tags")
@RequiredArgsConstructor
@Slf4j
public class TagController {

    private final TagService tagService;

    /**
     * Create a new tag.
     */
    @PostMapping
    public ResponseEntity<TagDTO> createTag(
            @PathVariable Long projectId,
            @Valid @RequestBody CreateTagRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        log.info("Create tag request for project {} by user {}", projectId, userId);

        TagDTO response = tagService.createTag(projectId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all tags for a project.
     */
    @GetMapping
    public ResponseEntity<List<TagDTO>> getProjectTags(
            @PathVariable Long projectId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        log.info("Get tags request for project {} by user {}", projectId, userId);

        List<TagDTO> tags = tagService.getProjectTags(projectId, userId);
        return ResponseEntity.ok(tags);
    }

    /**
     * Delete a tag.
     */
    @DeleteMapping("/{tagId}")
    public ResponseEntity<Void> deleteTag(
            @PathVariable Long projectId,
            @PathVariable Long tagId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        log.info("Delete tag {} from project {} by user {}", tagId, projectId, userId);

        tagService.deleteTag(tagId, userId);
        return ResponseEntity.noContent().build();
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }
}
