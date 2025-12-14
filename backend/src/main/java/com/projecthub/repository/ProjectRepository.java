package com.projecthub.repository;

import com.projecthub.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Project entity.
 * Provides CRUD operations and custom query methods.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    /**
     * Find all projects belonging to a specific user.
     *
     * @param userId the user's ID
     * @return list of projects owned by the user
     */
    List<Project> findByUserId(Long userId);

    /**
     * Find a project by ID and user ID (for ownership validation).
     *
     * @param id the project ID
     * @param userId the user's ID
     * @return Optional containing the project if found and owned by user
     */
    Optional<Project> findByIdAndUserId(Long id, Long userId);
}
