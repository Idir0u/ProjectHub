package com.projecthub.service;

import com.projecthub.dto.CreateProjectRequest;
import com.projecthub.dto.ProgressResponse;
import com.projecthub.dto.ProjectDetailResponse;
import com.projecthub.dto.ProjectResponse;
import com.projecthub.dto.TagDTO;
import com.projecthub.dto.TaskResponse;
import com.projecthub.exception.NotFoundException;
import com.projecthub.exception.UnauthorizedException;
import com.projecthub.model.Project;
import com.projecthub.model.ProjectMember;
import com.projecthub.model.ProjectRole;
import com.projecthub.model.Task;
import com.projecthub.model.User;
import com.projecthub.repository.ProjectMemberRepository;
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
    private final ProjectMemberService projectMemberService;

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

        // Automatically add creator as project owner
        projectMemberService.addCreatorAsOwner(savedProject.getId(), userId);

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

        // Get all projects user owns (original behavior)
        List<Project> ownedProjects = projectRepository.findByUserId(userId);
        
        // Get all projects user is a member of
        List<Project> memberProjects = projectMemberService.getUserMemberProjects(userId);
        
        // Combine and deduplicate
        List<Project> allProjects = new java.util.ArrayList<>(ownedProjects);
        memberProjects.stream()
            .filter(p -> !ownedProjects.contains(p))
            .forEach(allProjects::add);
        
        log.info("Found {} projects for user ID: {}", allProjects.size(), userId);

        return allProjects.stream()
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

        // Check if user is a member of the project
        if (!projectMemberService.isMember(projectId, userId)) {
            throw new UnauthorizedException("You don't have access to this project");
        }

        Project project = projectRepository.findById(projectId)
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

        // Verify user is a project member
        if (!projectMemberService.isMember(projectId, userId)) {
            throw new UnauthorizedException("You don't have access to this project");
        }

        Project project = projectRepository.findById(projectId)
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
                .map(task -> {
                    // Map tags
                    List<TagDTO> tagDTOs = task.getTags().stream()
                            .map(tag -> new TagDTO(tag.getId(), tag.getName(), tag.getColor(), tag.getProject().getId()))
                            .collect(Collectors.toList());
                    
                    // Map dependencies
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
                })
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
