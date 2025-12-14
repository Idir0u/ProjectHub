package com.projecthub.controller;

import com.projecthub.dto.CreateProjectRequest;
import com.projecthub.dto.ProgressResponse;
import com.projecthub.dto.ProjectDetailResponse;
import com.projecthub.dto.ProjectResponse;
import com.projecthub.security.UserDetailsImpl;
import com.projecthub.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for project management endpoints.
 * All endpoints require JWT authentication.
 */
@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
@Slf4j
public class ProjectController {

    private final ProjectService projectService;

    /**
     * Create a new project.
     * POST /api/projects
     *
     * @param request project details
     * @param authentication authenticated user
     * @return created project
     */
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        log.info("Create project request from user ID: {}", userId);

        ProjectResponse response = projectService.createProject(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all projects for the authenticated user.
     * GET /api/projects
     *
     * @param authentication authenticated user
     * @return list of projects
     */
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getUserProjects(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        log.info("Get projects request from user ID: {}", userId);

        List<ProjectResponse> projects = projectService.getUserProjects(userId);
        return ResponseEntity.ok(projects);
    }

    /**
     * Get project details by ID.
     * GET /api/projects/{id}
     *
     * @param id project ID
     * @param authentication authenticated user
     * @return project details with tasks
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDetailResponse> getProjectById(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        log.info("Get project {} request from user ID: {}", id, userId);

        ProjectDetailResponse response = projectService.getProjectById(id, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get project progress statistics.
     * GET /api/projects/{id}/progress
     *
     * @param id project ID
     * @param authentication authenticated user
     * @return progress statistics
     */
    @GetMapping("/{id}/progress")
    public ResponseEntity<ProgressResponse> getProjectProgress(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        log.info("Get progress for project {} from user ID: {}", id, userId);

        ProgressResponse response = projectService.getProjectProgress(id, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Extract user ID from authentication token.
     */
    private Long getUserIdFromAuth(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }
}
