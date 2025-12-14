package com.projecthub.service;

import com.projecthub.dto.CreateTaskRequest;
import com.projecthub.dto.TaskResponse;
import com.projecthub.dto.UpdateTaskRequest;
import com.projecthub.exception.NotFoundException;
import com.projecthub.model.Project;
import com.projecthub.model.Task;
import com.projecthub.repository.ProjectRepository;
import com.projecthub.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing tasks.
 * Handles business logic for task CRUD operations within projects.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    /**
     * Create a new task for a project.
     * Validates that the project belongs to the user.
     *
     * @param projectId project ID
     * @param request task details
     * @param userId authenticated user's ID
     * @return created task response
     */
    @Transactional
    public TaskResponse createTask(Long projectId, CreateTaskRequest request, Long userId) {
        log.debug("Creating task for project ID: {} by user ID: {}", projectId, userId);

        Project project = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new NotFoundException("Project", "id", projectId));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .completed(false)
                .project(project)
                .build();

        Task savedTask = taskRepository.save(task);
        log.info("Task created successfully: ID={}, Title={}, Project={}", 
                savedTask.getId(), savedTask.getTitle(), projectId);

        return mapToTaskResponse(savedTask);
    }

    /**
     * Get all tasks for a project.
     * Validates that the project belongs to the user.
     *
     * @param projectId project ID
     * @param userId authenticated user's ID
     * @return list of tasks
     */
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByProject(Long projectId, Long userId) {
        log.debug("Fetching tasks for project ID: {} by user ID: {}", projectId, userId);

        // Verify project ownership
        projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new NotFoundException("Project", "id", projectId));

        List<Task> tasks = taskRepository.findByProjectId(projectId);
        log.info("Found {} tasks for project ID: {}", tasks.size(), projectId);

        return tasks.stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
    }

    /**
     * Update task completion status.
     * Validates that the task belongs to a project owned by the user.
     *
     * @param taskId task ID
     * @param request update details
     * @param userId authenticated user's ID
     * @return updated task response
     */
    @Transactional
    public TaskResponse updateTask(Long taskId, UpdateTaskRequest request, Long userId) {
        log.debug("Updating task ID: {} by user ID: {}", taskId, userId);

        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new NotFoundException("Task", "id", taskId));

        if (request.getCompleted() != null) {
            task.setCompleted(request.getCompleted());
        }

        Task updatedTask = taskRepository.save(task);
        log.info("Task {} updated: completed={}", taskId, updatedTask.getCompleted());

        return mapToTaskResponse(updatedTask);
    }

    /**
     * Delete a task.
     * Validates that the task belongs to a project owned by the user.
     *
     * @param taskId task ID
     * @param userId authenticated user's ID
     */
    @Transactional
    public void deleteTask(Long taskId, Long userId) {
        log.debug("Deleting task ID: {} by user ID: {}", taskId, userId);

        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new NotFoundException("Task", "id", taskId));

        taskRepository.delete(task);
        log.info("Task {} deleted successfully", taskId);
    }

    /**
     * Map Task entity to TaskResponse DTO.
     */
    private TaskResponse mapToTaskResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .completed(task.getCompleted())
                .projectId(task.getProject().getId())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
