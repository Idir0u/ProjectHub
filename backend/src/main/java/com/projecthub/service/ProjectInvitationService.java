package com.projecthub.service;

import com.projecthub.dto.InvitationDTO;
import com.projecthub.dto.InviteUserRequest;
import com.projecthub.model.*;
import com.projecthub.repository.ProjectInvitationRepository;
import com.projecthub.repository.ProjectRepository;
import com.projecthub.model.InvitationStatus;
import com.projecthub.dto.ProjectMemberDTO;
import com.projecthub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for managing project invitations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectInvitationService {

    private final ProjectInvitationRepository invitationRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberService projectMemberService;

    /**
     * Send an invitation to a user to join a project.
     */
    @Transactional
    public InvitationDTO inviteUser(Long projectId, InviteUserRequest request, Long inviterId) {
        log.debug("Inviting user {} to project {}", request.getUserEmail(), projectId);

        // Verify project exists
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        // Verify inviter has permission (must be OWNER or ADMIN)
        projectMemberService.verifyCanManageMembers(projectId, inviterId);

        // Find user to invite
        User invitee = userRepository.findByEmail(request.getUserEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if already a member
        if (projectMemberService.isMember(projectId, invitee.getId())) {
            throw new IllegalArgumentException("User is already a member of this project");
        }

        // Check if there's already a pending invitation
        if (invitationRepository.existsByProjectIdAndInviteeIdAndStatus(
                projectId, invitee.getId(), InvitationStatus.PENDING)) {
            throw new IllegalArgumentException("User already has a pending invitation");
        }

        // Cannot invite as OWNER
        if (request.getRole() == ProjectRole.OWNER) {
            throw new IllegalArgumentException("Cannot invite someone as OWNER");
        }

        User inviter = userRepository.findById(inviterId)
                .orElseThrow(() -> new IllegalArgumentException("Inviter not found"));

        ProjectInvitation invitation = ProjectInvitation.builder()
                .project(project)
                .invitee(invitee)
                .inviter(inviter)
                .role(request.getRole())
                .status(InvitationStatus.PENDING)
                .build();

        invitation = invitationRepository.save(invitation);
        log.info("Invitation sent to {} for project {}", invitee.getEmail(), projectId);

        return toDTO(invitation);
    }

    /**
     * Accept an invitation.
     */
    @Transactional
    public void acceptInvitation(Long invitationId, Long userId) {
        log.debug("User {} accepting invitation {}", userId, invitationId);

        ProjectInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));

        // Verify this invitation is for the current user
        if (!invitation.getInvitee().getId().equals(userId)) {
            throw new IllegalArgumentException("This invitation is not for you");
        }

        // Check status
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new IllegalArgumentException("This invitation is no longer valid");
        }

        // Update invitation status
        invitation.setStatus(InvitationStatus.ACCEPTED);
        invitation.setRespondedAt(LocalDateTime.now());
        invitationRepository.save(invitation);

        // Add user as project member
        ProjectMember member = ProjectMember.builder()
                .project(invitation.getProject())
                .user(invitation.getInvitee())
                .role(invitation.getRole())
                .build();

        projectMemberService.saveMember(member);
        log.info("User {} accepted invitation and joined project {}", 
                userId, invitation.getProject().getId());
    }

    /**
     * Decline an invitation.
     */
    @Transactional
    public void declineInvitation(Long invitationId, Long userId) {
        log.debug("User {} declining invitation {}", userId, invitationId);

        ProjectInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));

        // Verify this invitation is for the current user
        if (!invitation.getInvitee().getId().equals(userId)) {
            throw new IllegalArgumentException("This invitation is not for you");
        }

        // Check status
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new IllegalArgumentException("This invitation is no longer valid");
        }

        invitation.setStatus(InvitationStatus.DECLINED);
        invitation.setRespondedAt(LocalDateTime.now());
        invitationRepository.save(invitation);
        log.info("User {} declined invitation to project {}", userId, invitation.getProject().getId());
    }

    /**
     * Cancel an invitation (by project admin/owner).
     */
    @Transactional
    public void cancelInvitation(Long invitationId, Long projectId, Long userId) {
        log.debug("Cancelling invitation {}", invitationId);

        // Verify user has permission
        projectMemberService.verifyCanManageMembers(projectId, userId);

        ProjectInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));

        if (!invitation.getProject().getId().equals(projectId)) {
            throw new IllegalArgumentException("Invitation does not belong to this project");
        }

        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new IllegalArgumentException("Can only cancel pending invitations");
        }

        invitation.setStatus(InvitationStatus.CANCELLED);
        invitation.setRespondedAt(LocalDateTime.now());
        invitationRepository.save(invitation);
        log.info("Invitation {} cancelled", invitationId);
    }

    /**
     * Get all pending invitations for a user.
     */
    @Transactional(readOnly = true)
    public List<InvitationDTO> getPendingInvitations(Long userId) {
        return invitationRepository.findByInviteeIdAndStatus(userId, InvitationStatus.PENDING)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all invitations for a project.
     */
    @Transactional(readOnly = true)
    public List<InvitationDTO> getProjectInvitations(Long projectId, Long userId) {
        // Verify user has permission
        projectMemberService.verifyCanManageMembers(projectId, userId);

        return invitationRepository.findByProjectId(projectId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Generate a unique invite code for a project.
     */
    @Transactional
    public String generateInviteCode(Long projectId, Long userId) {
        log.debug("Generating invite code for project {}", projectId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        // Verify user is owner or admin
        projectMemberService.verifyCanManageMembers(projectId, userId);

        // Generate unique code
        String inviteCode;
        do {
            inviteCode = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (projectRepository.existsByInviteCode(inviteCode));

        project.setInviteCode(inviteCode);
        projectRepository.save(project);
        log.info("Generated invite code {} for project {}", inviteCode, projectId);

        return inviteCode;
    }

    /**
     * Join a project using an invite code.
     */
    @Transactional
    public ProjectMemberDTO joinProjectByCode(String inviteCode, Long userId) {
        log.debug("User {} joining project with code {}", userId, inviteCode);

        Project project = projectRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid invite code"));

        // Check if already a member
        if (projectMemberService.isMember(project.getId(), userId)) {
            throw new IllegalArgumentException("You are already a member of this project");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Add user as MEMBER (default role for code joins)
        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(user)
                .role(ProjectRole.MEMBER)
                .build();

        projectMemberService.saveMember(member);
        log.info("User {} joined project {} via invite code", userId, project.getId());

        return ProjectMemberDTO.builder()
                .id(member.getId())
                .userId(user.getId())
                .userEmail(user.getEmail())
                .role(member.getRole())
                .joinedAt(member.getJoinedAt())
                .build();
    }

    /**
     * Convert entity to DTO.
     */
    private InvitationDTO toDTO(ProjectInvitation invitation) {
        return InvitationDTO.builder()
                .id(invitation.getId())
                .projectId(invitation.getProject().getId())
                .projectTitle(invitation.getProject().getTitle())
                .inviteeId(invitation.getInvitee().getId())
                .inviteeEmail(invitation.getInvitee().getEmail())
                .inviterId(invitation.getInviter().getId())
                .inviterEmail(invitation.getInviter().getEmail())
                .role(invitation.getRole())
                .status(invitation.getStatus())
                .invitedAt(invitation.getInvitedAt())
                .respondedAt(invitation.getRespondedAt())
                .build();
    }
}
