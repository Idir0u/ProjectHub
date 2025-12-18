package com.projecthub.repository;

import com.projecthub.model.ProjectMember;
import com.projecthub.model.ProjectRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for ProjectMember entity operations.
 */
@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    /**
     * Find all members of a specific project.
     */
    List<ProjectMember> findByProjectId(Long projectId);

    /**
     * Find all projects a user is a member of.
     */
    List<ProjectMember> findByUserId(Long userId);

    /**
     * Find a specific user's membership in a project.
     */
    Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId);

    /**
     * Check if a user is a member of a project.
     */
    boolean existsByProjectIdAndUserId(Long projectId, Long userId);

    /**
     * Find all members with a specific role in a project.
     */
    List<ProjectMember> findByProjectIdAndRole(Long projectId, ProjectRole role);

    /**
     * Delete a user's membership in a project.
     */
    void deleteByProjectIdAndUserId(Long projectId, Long userId);

    /**
     * Count the number of members in a project.
     */
    long countByProjectId(Long projectId);

    /**
     * Find project owner.
     */
    @Query("SELECT pm FROM ProjectMember pm WHERE pm.project.id = :projectId AND pm.role = 'OWNER'")
    Optional<ProjectMember> findOwnerByProjectId(@Param("projectId") Long projectId);
}
