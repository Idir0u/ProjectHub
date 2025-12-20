package com.projecthub.service;

import com.projecthub.dto.AddMemberRequest;
import com.projecthub.dto.ProjectMemberDTO;
import com.projecthub.dto.UpdateMemberRoleRequest;
import com.projecthub.model.Project;
import com.projecthub.model.ProjectMember;
import com.projecthub.model.ProjectRole;
import com.projecthub.model.User;
import com.projecthub.repository.ProjectMemberRepository;
import com.projecthub.repository.ProjectRepository;
import com.projecthub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing project members and their roles.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectMemberService {

    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    /**
     * Add project creator as owner (used during project creation).
     */
    @Transactional
    public void addCreatorAsOwner(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ProjectMember owner = ProjectMember.builder()
                .project(project)
                .user(user)
                .role(ProjectRole.OWNER)
                .build();

        projectMemberRepository.save(owner);
        log.info("Added user {} as owner of project {}", userId, projectId);
    }

    /**
     * Get all projects where user is a member.
     */
    @Transactional(readOnly = true)
    public List<Project> getUserMemberProjects(Long userId) {
        return projectMemberRepository.findByUserId(userId).stream()
                .map(ProjectMember::getProject)
                .collect(Collectors.toList());
    }

    /**
     * Add a member to a project.
     */
    @Transactional
    public ProjectMemberDTO addMember(Long projectId, AddMemberRequest request, Long requestingUserId) {
        log.debug("Adding member {} to project {}", request.getUserEmail(), projectId);

        // Verify project exists
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        // Verify requesting user has permission (must be OWNER or ADMIN)
        verifyCanManageMembers(projectId, requestingUserId);

        // Find user to add
        User userToAdd = userRepository.findByEmail(request.getUserEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if already a member
        if (projectMemberRepository.existsByProjectIdAndUserId(projectId, userToAdd.getId())) {
            throw new IllegalArgumentException("User is already a member of this project");
        }

        // Cannot add another OWNER
        if (request.getRole() == ProjectRole.OWNER) {
            throw new IllegalArgumentException("Cannot add another owner. Each project can only have one owner.");
        }

        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(userToAdd)
                .role(request.getRole())
                .build();

        member = projectMemberRepository.save(member);
        log.info("Added member {} to project {} with role {}", userToAdd.getEmail(), projectId, request.getRole());

        return toDTO(member);
    }

    /**
     * Remove a member from a project.
     */
    @Transactional
    public void removeMember(Long projectId, Long userIdToRemove, Long requestingUserId) {
        log.debug("Removing member {} from project {}", userIdToRemove, projectId);

        // Verify requesting user has permission
        verifyCanManageMembers(projectId, requestingUserId);

        // Find the member to remove
        ProjectMember memberToRemove = projectMemberRepository.findByProjectIdAndUserId(projectId, userIdToRemove)
                .orElseThrow(() -> new IllegalArgumentException("Member not found in project"));

        // Cannot remove the owner
        if (memberToRemove.getRole() == ProjectRole.OWNER) {
            throw new IllegalArgumentException("Cannot remove the project owner");
        }

        projectMemberRepository.deleteByProjectIdAndUserId(projectId, userIdToRemove);
        log.info("Removed member {} from project {}", userIdToRemove, projectId);
    }

    /**
     * Update a member's role.
     */
    @Transactional
    public ProjectMemberDTO updateMemberRole(Long projectId, Long userId, UpdateMemberRoleRequest request, Long requestingUserId) {
        log.debug("Updating role for member {} in project {} to {}", userId, projectId, request.getRole());

        // Only OWNER can update roles
        verifyIsOwner(projectId, requestingUserId);

        ProjectMember member = projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found in project"));

        // Cannot change owner role
        if (member.getRole() == ProjectRole.OWNER) {
            throw new IllegalArgumentException("Cannot change the owner's role");
        }

        // Cannot make someone else owner
        if (request.getRole() == ProjectRole.OWNER) {
            throw new IllegalArgumentException("Cannot assign OWNER role. Each project can only have one owner.");
        }

        member.setRole(request.getRole());
        member = projectMemberRepository.save(member);
        log.info("Updated role for member {} in project {} to {}", userId, projectId, request.getRole());

        return toDTO(member);
    }

    /**
     * Get all members of a project.
     */
    @Transactional(readOnly = true)
    public List<ProjectMemberDTO> getProjectMembers(Long projectId, Long requestingUserId) {
        // Verify user has access to this project
        verifyIsMember(projectId, requestingUserId);

        return projectMemberRepository.findByProjectId(projectId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get user's role in a project.
     */
    @Transactional(readOnly = true)
    public ProjectRole getUserRole(Long projectId, Long userId) {
        return projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
                .map(ProjectMember::getRole)
                .orElse(null);
    }

    /**
     * Check if user is a member of a project.
     */
    @Transactional(readOnly = true)
    public boolean isMember(Long projectId, Long userId) {
        return projectMemberRepository.existsByProjectIdAndUserId(projectId, userId);
    }

    /**
     * Check if user is the owner of a project.
     */
    @Transactional(readOnly = true)
    public boolean isOwner(Long projectId, Long userId) {
        return projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
                .map(member -> member.getRole() == ProjectRole.OWNER)
                .orElse(false);
    }

    /**
     * Check if user is an admin of a project.
     */
    @Transactional(readOnly = true)
    public boolean isAdmin(Long projectId, Long userId) {
        return projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
                .map(member -> member.getRole() == ProjectRole.ADMIN)
                .orElse(false);
    }

    /**
     * Verify user can manage members (OWNER or ADMIN).
     */
    public void verifyCanManageMembers(Long projectId, Long userId) {
        ProjectMember member = projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this project"));

        if (member.getRole() != ProjectRole.OWNER && member.getRole() != ProjectRole.ADMIN) {
            throw new IllegalArgumentException("Only project owners and admins can manage members");
        }
    }

    /**
     * Save a project member (package-private for invitation service).
     */
    public void saveMember(ProjectMember member) {
        projectMemberRepository.save(member);
    }

    /**
     * Verify user is the project owner.
     */
    private void verifyIsOwner(Long projectId, Long userId) {
        ProjectMember member = projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this project"));

        if (member.getRole() != ProjectRole.OWNER) {
            throw new IllegalArgumentException("Only the project owner can perform this action");
        }
    }

    /**
     * Verify user is a member of the project.
     */
    private void verifyIsMember(Long projectId, Long userId) {
        if (!projectMemberRepository.existsByProjectIdAndUserId(projectId, userId)) {
            throw new IllegalArgumentException("You are not a member of this project");
        }
    }

    /**
     * Convert entity to DTO.
     */
    private ProjectMemberDTO toDTO(ProjectMember member) {
        return ProjectMemberDTO.builder()
                .id(member.getId())
                .userId(member.getUser().getId())
                .userEmail(member.getUser().getEmail())
                .role(member.getRole())
                .joinedAt(member.getJoinedAt())
                .build();
    }
}
