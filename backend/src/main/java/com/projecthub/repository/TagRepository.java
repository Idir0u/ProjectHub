package com.projecthub.repository;

import com.projecthub.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Tag entity operations.
 */
@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    /**
     * Find all tags for a project.
     */
    List<Tag> findByProjectId(Long projectId);

    /**
     * Find tag by name and project.
     */
    Optional<Tag> findByNameAndProjectId(String name, Long projectId);

    /**
     * Check if tag exists by name and project.
     */
    boolean existsByNameAndProjectId(String name, Long projectId);

    /**
     * Delete all tags for a project.
     */
    void deleteByProjectId(Long projectId);
}
