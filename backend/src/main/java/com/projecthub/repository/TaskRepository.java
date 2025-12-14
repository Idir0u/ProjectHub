package com.projecthub.repository;

import com.projecthub.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Task entity.
 * Provides CRUD operations and custom query methods.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Find all tasks belonging to a specific project.
     *
     * @param projectId the project ID
     * @return list of tasks in the project
     */
    List<Task> findByProjectId(Long projectId);

    /**
     * Find a task by ID and verify it belongs to a project owned by the user.
     * This ensures users can only access their own tasks.
     *
     * @param id the task ID
     * @param userId the user's ID
     * @return Optional containing the task if found and owned by user
     */
    @Query("SELECT t FROM Task t WHERE t.id = :id AND t.project.user.id = :userId")
    Optional<Task> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);

    /**
     * Count total tasks for a project.
     *
     * @param projectId the project ID
     * @return total number of tasks
     */
    long countByProjectId(Long projectId);

    /**
     * Count completed tasks for a project.
     *
     * @param projectId the project ID
     * @param completed the completion status
     * @return number of completed tasks
     */
    long countByProjectIdAndCompleted(Long projectId, Boolean completed);
}
