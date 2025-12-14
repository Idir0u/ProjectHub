package com.projecthub.service;

import com.projecthub.dto.CreateProjectRequest;
import com.projecthub.dto.ProgressResponse;
import com.projecthub.dto.ProjectDetailResponse;
import com.projecthub.dto.ProjectResponse;
import com.projecthub.dto.TaskResponse;
import com.projecthub.exception.NotFoundException;
import com.projecthub.exception.UnauthorizedException;
import com.projecthub.model.Project;
import com.projecthub.model.User;
import com.projecthub.repository.ProjectRepository;
import com.projecthub.repository.TaskRepository;
import com.projecthub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing projects.
 * Handles business logic for project CRUD operations and progress tracking.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    /**
     * Create a new project for the authenticated user.
     *
     * @param request project details
     * @param userId authenticated user's ID
     * @return created project response
     */
    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request, Long userId) {
        log.debug("Creating project for user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User", "id", userId));

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .user(user)
                .build();

        Project savedProject = projectRepository.save(project);
        log.info("Project created successfully: ID={}, Title={}", savedProject.getId(), savedProject.getTitle());

        return mapToProjectResponse(savedProject);
    }

    /**
     * Get all projects for the authenticated user.
     *
     * @param userId authenticated user's ID
     * @return list of user's projects
     */
    @Transactional(readOnly = true)
    public List<ProjectResponse> getUserProjects(Long userId) {
        log.debug("Fetching projects for user ID: {}", userId);

        List<Project> projects = projectRepository.findByUserId(userId);
        log.info("Found {} projects for user ID: {}", projects.size(), userId);

        return projects.stream()
                .map(this::mapToProjectResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get project details by ID with ownership validation.
     *
     * @param projectId project ID
     * @param userId authenticated user's ID
     * @return project details with tasks
     */
    @Transactional(readOnly = true)
    public ProjectDetailResponse getProjectById(Long projectId, Long userId) {
        log.debug("Fetching project ID: {} for user ID: {}", projectId, userId);

        Project project = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new NotFoundException("Project", "id", projectId));

        return mapToProjectDetailResponse(project);
    }

    /**
     * Get project progress statistics.
     *
     * @param projectId project ID
     * @param userId authenticated user's ID
     * @return progress statistics
     */
    @Transactional(readOnly = true)
    public ProgressResponse getProjectProgress(Long projectId, Long userId) {
        log.debug("Calculating progress for project ID: {} and user ID: {}", projectId, userId);

        // Verify project ownership
        Project project = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new NotFoundException("Project", "id", projectId));

        long totalTasks = taskRepository.countByProjectId(projectId);
        long completedTasks = taskRepository.countByProjectIdAndCompleted(projectId, true);

        ProgressResponse progress = ProgressResponse.builder()
                .projectId(projectId)
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .build();

        progress.calculateProgress();

        log.info("Project {} progress: {}/{}  ({}%)", projectId, completedTasks, totalTasks, progress.getProgressPercentage());

        return progress;
    }

    /**
     * Map Project entity to ProjectResponse DTO.
     */
    private ProjectResponse mapToProjectResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .userId(project.getUser().getId())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    /**
     * Map Project entity to ProjectDetailResponse DTO with tasks.
     */
    private ProjectDetailResponse mapToProjectDetailResponse(Project project) {
        List<TaskResponse> taskResponses = project.getTasks().stream()
                .map(task -> TaskResponse.builder()
                        .id(task.getId())
                        .title(task.getTitle())
                        .description(task.getDescription())
                        .dueDate(task.getDueDate())
                        .completed(task.getCompleted())
                        .projectId(task.getProject().getId())
                        .createdAt(task.getCreatedAt())
                        .updatedAt(task.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        return ProjectDetailResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .userId(project.getUser().getId())
                .tasks(taskResponses)
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
