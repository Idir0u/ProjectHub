package com.projecthub.controller;

import com.projecthub.dto.AddMemberRequest;
import com.projecthub.dto.ProjectMemberDTO;
import com.projecthub.dto.UpdateMemberRoleRequest;
import com.projecthub.security.UserDetailsImpl;
import com.projecthub.service.ProjectMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing project members.
 * Provides endpoints for adding, removing, and updating project members.
 */
@RestController
@RequestMapping("/projects/{projectId}/members")
@RequiredArgsConstructor
@Slf4j
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;

    /**
     * Get all members of a project.
     * GET /projects/{projectId}/members
     */
    @GetMapping
    public ResponseEntity<List<ProjectMemberDTO>> getProjectMembers(
            @PathVariable Long projectId,
            Authentication authentication) {
        
        Long userId = getUserIdFromAuth(authentication);
        log.info("User {} retrieving members for project {}", userId, projectId);

        List<ProjectMemberDTO> members = projectMemberService.getProjectMembers(projectId, userId);
        return ResponseEntity.ok(members);
    }

    /**
     * Add a member to a project.
     * POST /projects/{projectId}/members
     */
    @PostMapping
    public ResponseEntity<ProjectMemberDTO> addMember(
            @PathVariable Long projectId,
            @Valid @RequestBody AddMemberRequest request,
            Authentication authentication) {
        
        Long userId = getUserIdFromAuth(authentication);
        log.info("User {} adding member {} to project {}", userId, request.getUserEmail(), projectId);

        ProjectMemberDTO member = projectMemberService.addMember(projectId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(member);
    }

    /**
     * Remove a member from a project.
     * DELETE /projects/{projectId}/members/{userId}
     */
    @DeleteMapping("/{memberUserId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long projectId,
            @PathVariable Long memberUserId,
            Authentication authentication) {
        
        Long userId = getUserIdFromAuth(authentication);
        log.info("User {} removing member {} from project {}", userId, memberUserId, projectId);

        projectMemberService.removeMember(projectId, memberUserId, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Update a member's role.
     * PUT /projects/{projectId}/members/{userId}/role
     */
    @PutMapping("/{memberUserId}/role")
    public ResponseEntity<ProjectMemberDTO> updateMemberRole(
            @PathVariable Long projectId,
            @PathVariable Long memberUserId,
            @Valid @RequestBody UpdateMemberRoleRequest request,
            Authentication authentication) {
        
        Long userId = getUserIdFromAuth(authentication);
        log.info("User {} updating role for member {} in project {} to {}", 
                userId, memberUserId, projectId, request.getRole());

        ProjectMemberDTO member = projectMemberService.updateMemberRole(
                projectId, memberUserId, request, userId);
        return ResponseEntity.ok(member);
    }

    /**
     * Extract user ID from authentication object.
     */
    private Long getUserIdFromAuth(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }
}
