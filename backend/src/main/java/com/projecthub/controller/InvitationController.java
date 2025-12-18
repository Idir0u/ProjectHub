package com.projecthub.controller;

import com.projecthub.dto.InvitationDTO;
import com.projecthub.dto.InviteUserRequest;
import com.projecthub.dto.JoinProjectRequest;
import com.projecthub.dto.ProjectMemberDTO;
import com.projecthub.security.UserDetailsImpl;
import com.projecthub.service.ProjectInvitationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for managing project invitations.
 */
@RestController
@RequestMapping("/invitations")
@RequiredArgsConstructor
@Slf4j
public class InvitationController {

    private final ProjectInvitationService invitationService;

    /**
     * Get all pending invitations for the authenticated user.
     * GET /invitations/pending
     */
    @GetMapping("/pending")
    public ResponseEntity<List<InvitationDTO>> getPendingInvitations(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        log.info("User {} retrieving pending invitations", userId);

        List<InvitationDTO> invitations = invitationService.getPendingInvitations(userId);
        return ResponseEntity.ok(invitations);
    }

    /**
     * Send an invitation to a user.
     * POST /invitations/projects/{projectId}/invite
     */
    @PostMapping("/projects/{projectId}/invite")
    public ResponseEntity<InvitationDTO> inviteUser(
            @PathVariable Long projectId,
            @Valid @RequestBody InviteUserRequest request,
            Authentication authentication) {
        
        Long userId = getUserIdFromAuth(authentication);
        log.info("User {} inviting {} to project {}", userId, request.getUserEmail(), projectId);

        InvitationDTO invitation = invitationService.inviteUser(projectId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(invitation);
    }

    /**
     * Get all invitations for a project.
     * GET /invitations/projects/{projectId}
     */
    @GetMapping("/projects/{projectId}")
    public ResponseEntity<List<InvitationDTO>> getProjectInvitations(
            @PathVariable Long projectId,
            Authentication authentication) {
        
        Long userId = getUserIdFromAuth(authentication);
        log.info("User {} retrieving invitations for project {}", userId, projectId);

        List<InvitationDTO> invitations = invitationService.getProjectInvitations(projectId, userId);
        return ResponseEntity.ok(invitations);
    }

    /**
     * Accept an invitation.
     * POST /invitations/{invitationId}/accept
     */
    @PostMapping("/{invitationId}/accept")
    public ResponseEntity<Void> acceptInvitation(
            @PathVariable Long invitationId,
            Authentication authentication) {
        
        Long userId = getUserIdFromAuth(authentication);
        log.info("User {} accepting invitation {}", userId, invitationId);

        invitationService.acceptInvitation(invitationId, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * Decline an invitation.
     * POST /invitations/{invitationId}/decline
     */
    @PostMapping("/{invitationId}/decline")
    public ResponseEntity<Void> declineInvitation(
            @PathVariable Long invitationId,
            Authentication authentication) {
        
        Long userId = getUserIdFromAuth(authentication);
        log.info("User {} declining invitation {}", userId, invitationId);

        invitationService.declineInvitation(invitationId, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Cancel an invitation.
     * DELETE /invitations/projects/{projectId}/invitations/{invitationId}
     */
    @DeleteMapping("/projects/{projectId}/invitations/{invitationId}")
    public ResponseEntity<Void> cancelInvitation(
            @PathVariable Long projectId,
            @PathVariable Long invitationId,
            Authentication authentication) {
        
        Long userId = getUserIdFromAuth(authentication);
        log.info("User {} cancelling invitation {}", userId, invitationId);

        invitationService.cancelInvitation(invitationId, projectId, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Generate invite code for a project.
     * POST /invitations/projects/{projectId}/code
     */
    @PostMapping("/projects/{projectId}/code")
    public ResponseEntity<Map<String, String>> generateInviteCode(
            @PathVariable Long projectId,
            Authentication authentication) {
        
        Long userId = getUserIdFromAuth(authentication);
        log.info("User {} generating invite code for project {}", userId, projectId);

        String code = invitationService.generateInviteCode(projectId, userId);
        return ResponseEntity.ok(Map.of("inviteCode", code));
    }

    /**
     * Join a project using an invite code.
     * POST /invitations/join
     */
    @PostMapping("/join")
    public ResponseEntity<ProjectMemberDTO> joinProject(
            @Valid @RequestBody JoinProjectRequest request,
            Authentication authentication) {
        
        Long userId = getUserIdFromAuth(authentication);
        log.info("User {} joining project with code {}", userId, request.getInviteCode());

        ProjectMemberDTO member = invitationService.joinProjectByCode(request.getInviteCode(), userId);
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
