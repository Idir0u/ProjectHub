package com.projecthub.repository;

import com.projecthub.model.InvitationStatus;
import com.projecthub.model.ProjectInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for ProjectInvitation entity operations.
 */
@Repository
public interface ProjectInvitationRepository extends JpaRepository<ProjectInvitation, Long> {

    /**
     * Find all invitations for a project.
     */
    List<ProjectInvitation> findByProjectId(Long projectId);

    /**
     * Find all invitations sent to a user.
     */
    List<ProjectInvitation> findByInviteeId(Long inviteeId);

    /**
     * Find pending invitations for a user.
     */
    List<ProjectInvitation> findByInviteeIdAndStatus(Long inviteeId, InvitationStatus status);

    /**
     * Find pending invitation for a specific user and project.
     */
    Optional<ProjectInvitation> findByProjectIdAndInviteeIdAndStatus(
            Long projectId, Long inviteeId, InvitationStatus status);

    /**
     * Check if there's a pending invitation.
     */
    boolean existsByProjectIdAndInviteeIdAndStatus(
            Long projectId, Long inviteeId, InvitationStatus status);

    /**
     * Delete all invitations for a project.
     */
    void deleteByProjectId(Long projectId);
}
