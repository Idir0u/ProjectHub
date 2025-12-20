package com.projecthub.service;

import com.projecthub.dto.CreateTaskRequest;
import com.projecthub.dto.TagDTO;
import com.projecthub.dto.TaskResponse;
import com.projecthub.dto.UpdateTaskRequest;
import com.projecthub.exception.NotFoundException;
import com.projecthub.model.*;
import com.projecthub.repository.ProjectRepository;
import com.projecthub.repository.TagRepository;
import com.projecthub.repository.TaskRepository;
import com.projecthub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
    private final ProjectMemberService projectMemberService;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

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

        // Verify user is a member of the project
        if (!projectMemberService.isMember(projectId, userId)) {
            throw new NotFoundException("Project", "id", projectId);
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Project", "id", projectId));

        // Load tags if provided
        Set<Tag> tags = new HashSet<>();
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            tags = new HashSet<>(tagRepository.findAllById(request.getTagIds()));
        }

        // Load dependencies if provided
        Set<Task> dependencies = new HashSet<>();
        if (request.getDependsOnIds() != null && !request.getDependsOnIds().isEmpty()) {
            dependencies = new HashSet<>(taskRepository.findAllById(request.getDependsOnIds()));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .recurrencePattern(request.getRecurrencePattern() != null ? request.getRecurrencePattern() : RecurrencePattern.NONE)
                .recurrenceEndDate(request.getRecurrenceEndDate())
                .completed(false)
                .project(project)
                .tags(tags)
                .dependsOn(dependencies)
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

        // Verify user is a member of the project
        if (!projectMemberService.isMember(projectId, userId)) {
            throw new NotFoundException("Project", "id", projectId);
        }

        List<Task> tasks = taskRepository.findByProjectId(projectId);
        log.info("Found {} tasks for project ID: {}", tasks.size(), projectId);

        return tasks.stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
    }

    /**
     * Update task completion status.
     * Only the assigned user, project owner, or admin can update task completion.
     *
     * @param taskId task ID
     * @param request update details
     * @param userId authenticated user's ID
     * @return updated task response
     */
    @Transactional
    public TaskResponse updateTask(Long taskId, UpdateTaskRequest request, Long userId) {
        log.debug("Updating task ID: {} by user ID: {}", taskId, userId);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Task", "id", taskId));

        Long projectId = task.getProject().getId();

        // Verify user is a member of the project
        if (!projectMemberService.isMember(projectId, userId)) {
            throw new IllegalArgumentException("You don't have access to this project");
        }

        // Check authorization: must be assigned user, owner, or admin
        boolean isAssigned = task.getAssignedTo() != null && task.getAssignedTo().getId().equals(userId);
        boolean isOwnerOrAdmin = projectMemberService.isOwner(projectId, userId) || 
                                 projectMemberService.isAdmin(projectId, userId);

        if (!isAssigned && !isOwnerOrAdmin) {
            throw new IllegalArgumentException("Only the assigned user or project admins can update this task");
        }

        if (request.getCompleted() != null) {
            task.setCompleted(request.getCompleted());
        }

        Task updatedTask = taskRepository.save(task);
        log.info("Task {} updated by user {}: completed={}", taskId, userId, updatedTask.getCompleted());

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
        List<TagDTO> tagDTOs = task.getTags().stream()
                .map(tag -> TagDTO.builder()
                        .id(tag.getId())
                        .name(tag.getName())
                        .color(tag.getColor())
                        .projectId(tag.getProject().getId())
                        .build())
                .collect(Collectors.toList());

        List<Long> dependsOnIds = task.getDependsOn().stream()
                .map(Task::getId)
                .collect(Collectors.toList());

        List<Long> blockedByIds = task.getBlockedBy().stream()
                .map(Task::getId)
                .collect(Collectors.toList());

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .completed(task.getCompleted())
                .status(task.getStatus())
                .priority(task.getPriority())
                .recurrencePattern(task.getRecurrencePattern())
                .recurrenceEndDate(task.getRecurrenceEndDate())
                .projectId(task.getProject().getId())
                .assignedToId(task.getAssignedTo() != null ? task.getAssignedTo().getId() : null)
                .assignedToEmail(task.getAssignedTo() != null ? task.getAssignedTo().getEmail() : null)
                .tags(tagDTOs)
                .dependsOnIds(dependsOnIds)
                .blockedByIds(blockedByIds)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    /**
     * Assign a task to a user.
     */
    @Transactional
    public TaskResponse assignTask(Long taskId, Long assigneeId, Long userId) {
        log.debug("Assigning task {} to user {}", taskId, assigneeId);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Task", "id", taskId));

        Long projectId = task.getProject().getId();

        // Verify requester is a member
        if (!projectMemberService.isMember(projectId, userId)) {
            throw new IllegalArgumentException("You don't have access to this project");
        }

        // Verify assignee is a member of the project
        if (!projectMemberService.isMember(projectId, assigneeId)) {
            throw new IllegalArgumentException("Cannot assign task to non-member");
        }

        com.projecthub.model.User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new NotFoundException("User", "id", assigneeId));

        task.setAssignedTo(assignee);
        task = taskRepository.save(task);
        log.info("Task {} assigned to user {}", taskId, assigneeId);

        return mapToTaskResponse(task);
    }

    /**
     * Unassign a task.
     */
    @Transactional
    public TaskResponse unassignTask(Long taskId, Long userId) {
        log.debug("Unassigning task {}", taskId);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Task", "id", taskId));

        // Verify user is a member of the project
        if (!projectMemberService.isMember(task.getProject().getId(), userId)) {
            throw new IllegalArgumentException("You don't have access to this project");
        }

        task.setAssignedTo(null);
        task = taskRepository.save(task);
        log.info("Task {} unassigned", taskId);

        return mapToTaskResponse(task);
    }

    /**
     * Update task status (for Kanban board drag-and-drop).
     * Only the assigned user, project owner, or admin can update task status.
     */
    @Transactional
    public TaskResponse updateTaskStatus(Long taskId, TaskStatus status, Long userId) {
        log.debug("Updating task {} status to {}", taskId, status);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Task", "id", taskId));

        Long projectId = task.getProject().getId();

        // Verify user is a member of the project
        if (!projectMemberService.isMember(projectId, userId)) {
            throw new IllegalArgumentException("You don't have access to this project");
        }

        // Check authorization: must be assigned user, owner, or admin
        boolean isAssigned = task.getAssignedTo() != null && task.getAssignedTo().getId().equals(userId);
        boolean isOwnerOrAdmin = projectMemberService.isOwner(projectId, userId) || 
                                 projectMemberService.isAdmin(projectId, userId);

        if (!isAssigned && !isOwnerOrAdmin) {
            throw new IllegalArgumentException("Only the assigned user or project admins can update task status");
        }

        task.setStatus(status);
        
        // Auto-mark as completed when moved to DONE
        if (status == TaskStatus.DONE) {
            task.setCompleted(true);
        } else if (task.getCompleted()) {
            // Unmark completed if moved back to TODO or IN_PROGRESS
            task.setCompleted(false);
        }

        task = taskRepository.save(task);
        log.info("Task {} status updated to {} by user {}", taskId, status, userId);

        return mapToTaskResponse(task);
    }

    /**
     * Bulk complete tasks.
     */
    @Transactional
    public void bulkCompleteTasks(List<Long> taskIds, Long userId) {
        log.debug("Bulk completing {} tasks", taskIds.size());

        List<Task> tasks = taskRepository.findAllById(taskIds);
        
        for (Task task : tasks) {
            // Verify user is a member
            if (!projectMemberService.isMember(task.getProject().getId(), userId)) {
                continue; // Skip tasks user doesn't have access to
            }
            
            // Check dependencies
            boolean canComplete = task.getDependsOn().stream()
                    .allMatch(Task::getCompleted);
            
            if (canComplete) {
                task.setCompleted(true);
                task.setStatus(TaskStatus.DONE);
            }
        }
        
        taskRepository.saveAll(tasks);
        log.info("Bulk completed {} tasks", tasks.size());
    }

    /**
     * Bulk delete tasks.
     */
    @Transactional
    public void bulkDeleteTasks(List<Long> taskIds, Long userId) {
        log.debug("Bulk deleting {} tasks", taskIds.size());

        List<Task> tasks = taskRepository.findAllById(taskIds);
        List<Task> tasksToDelete = tasks.stream()
                .filter(task -> projectMemberService.isMember(task.getProject().getId(), userId))
                .collect(Collectors.toList());

        taskRepository.deleteAll(tasksToDelete);
        log.info("Bulk deleted {} tasks", tasksToDelete.size());
    }
}
