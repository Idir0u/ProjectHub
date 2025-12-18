package com.projecthub.controller;

import com.projecthub.dto.AssignTaskRequest;
import com.projecthub.dto.CreateTaskRequest;
import com.projecthub.dto.TaskResponse;
import com.projecthub.dto.UpdateTaskRequest;
import com.projecthub.security.UserDetailsImpl;
import com.projecthub.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for task management endpoints.
 * All endpoints require JWT authentication.
 */
@RestController
@RequiredArgsConstructor
@Slf4j
public class TaskController {

    private final TaskService taskService;

    /**
     * Create a new task for a project.
     * POST /api/projects/{projectId}/tasks
     *
     * @param projectId project ID
     * @param request task details
     * @param authentication authenticated user
     * @return created task
     */
    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody CreateTaskRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        log.info("Create task request for project {} from user ID: {}", projectId, userId);

        TaskResponse response = taskService.createTask(projectId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all tasks for a project.
     * GET /api/projects/{projectId}/tasks
     *
     * @param projectId project ID
     * @param authentication authenticated user
     * @return list of tasks
     */
    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskResponse>> getTasksByProject(
            @PathVariable Long projectId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        log.info("Get tasks request for project {} from user ID: {}", projectId, userId);

        List<TaskResponse> tasks = taskService.getTasksByProject(projectId, userId);
        return ResponseEntity.ok(tasks);
    }

    /**
     * Update task completion status.
     * PATCH /api/tasks/{taskId}
     *
     * @param taskId task ID
     * @param request update details
     * @param authentication authenticated user
     * @return updated task
     */
    @PatchMapping("/tasks/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        log.info("Update task {} request from user ID: {}", taskId, userId);

        TaskResponse response = taskService.updateTask(taskId, request, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a task.
     * DELETE /api/tasks/{taskId}
     *
     * @param taskId task ID
     * @param authentication authenticated user
     * @return no content
     */
    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        log.info("Delete task {} request from user ID: {}", taskId, userId);

        taskService.deleteTask(taskId, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Extract user ID from authentication token.
     */
    private Long getUserIdFromAuth(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }

    /**
     * Assign a task to a user.
     * PUT /api/tasks/{taskId}/assign
     *
     * @param taskId task ID
     * @param request assignment details
     * @param authentication authenticated user
     * @return updated task
     */
    @PutMapping("/tasks/{taskId}/assign")
    public ResponseEntity<TaskResponse> assignTask(
            @PathVariable Long taskId,
            @Valid @RequestBody AssignTaskRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        log.info("Assign task {} to user {} by user {}", taskId, request.getUserId(), userId);

        TaskResponse response = taskService.assignTask(taskId, request.getUserId(), userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Unassign a task.
     * DELETE /api/tasks/{taskId}/assign
     *
     * @param taskId task ID
     * @param authentication authenticated user
     * @return updated task
     */
    @DeleteMapping("/tasks/{taskId}/assign")
    public ResponseEntity<TaskResponse> unassignTask(
            @PathVariable Long taskId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        log.info("Unassign task {} by user {}", taskId, userId);

        TaskResponse response = taskService.unassignTask(taskId, userId);
        return ResponseEntity.ok(response);
    }
}
