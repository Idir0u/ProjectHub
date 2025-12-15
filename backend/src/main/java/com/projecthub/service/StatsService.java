package com.projecthub.service;

import com.projecthub.dto.UserStatsResponse;
import com.projecthub.model.Project;
import com.projecthub.model.Task;
import com.projecthub.repository.ProjectRepository;
import com.projecthub.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatsService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    @Transactional(readOnly = true)
    public UserStatsResponse getUserStatistics(Long userId) {
        log.debug("Fetching statistics for user ID: {}", userId);

        List<Project> projects = projectRepository.findByUserId(userId);
        List<Task> allTasks = new ArrayList<>();
        Map<String, Integer> projectsProgress = new HashMap<>();

        for (Project project : projects) {
            List<Task> projectTasks = taskRepository.findByProjectId(project.getId());
            allTasks.addAll(projectTasks);
            
            // Calculate progress for each project
            if (!projectTasks.isEmpty()) {
                long completedCount = projectTasks.stream().filter(Task::getCompleted).count();
                int progress = (int) ((completedCount * 100.0) / projectTasks.size());
                projectsProgress.put(project.getTitle(), progress);
            } else {
                projectsProgress.put(project.getTitle(), 0);
            }
        }

        long completedTasksCount = allTasks.stream().filter(Task::getCompleted).count();
        long activeTasksCount = allTasks.size() - completedTasksCount;
        double completionRate = allTasks.isEmpty() ? 0.0 : (completedTasksCount * 100.0) / allTasks.size();

        // Generate recent activities
        List<UserStatsResponse.RecentActivity> recentActivities = generateRecentActivities(projects, allTasks);

        // Tasks completed over time (last 30 days)
        Map<LocalDate, Integer> tasksCompletedOverTime = generateTasksCompletedOverTime(allTasks);

        log.info("Statistics calculated for user ID: {} - Projects: {}, Tasks: {}, Completed: {}",
                userId, projects.size(), allTasks.size(), completedTasksCount);

        return UserStatsResponse.builder()
                .totalProjects(projects.size())
                .totalTasks(allTasks.size())
                .completedTasks((int) completedTasksCount)
                .activeTasks((int) activeTasksCount)
                .completionRate(Math.round(completionRate * 10.0) / 10.0)
                .projectsProgress(projectsProgress)
                .recentActivities(recentActivities)
                .tasksCompletedOverTime(tasksCompletedOverTime)
                .build();
    }

    private List<UserStatsResponse.RecentActivity> generateRecentActivities(List<Project> projects, List<Task> tasks) {
        List<UserStatsResponse.RecentActivity> activities = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // Add project creation activities
        for (Project project : projects) {
            activities.add(UserStatsResponse.RecentActivity.builder()
                    .type("PROJECT_CREATED")
                    .description("Created project")
                    .projectName(project.getTitle())
                    .timestamp(project.getCreatedAt().format(formatter))
                    .build());
        }

        // Add task activities
        for (Task task : tasks) {
            String projectName = task.getProject() != null ? task.getProject().getTitle() : "Unknown";
            
            activities.add(UserStatsResponse.RecentActivity.builder()
                    .type("TASK_CREATED")
                    .description("Created task: " + task.getTitle())
                    .projectName(projectName)
                    .timestamp(task.getCreatedAt().format(formatter))
                    .build());

            if (task.getCompleted() && task.getUpdatedAt() != null) {
                activities.add(UserStatsResponse.RecentActivity.builder()
                        .type("TASK_COMPLETED")
                        .description("Completed task: " + task.getTitle())
                        .projectName(projectName)
                        .timestamp(task.getUpdatedAt().format(formatter))
                        .build());
            }
        }

        // Sort by timestamp descending and limit to 10
        return activities.stream()
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .limit(10)
                .collect(Collectors.toList());
    }

    private Map<LocalDate, Integer> generateTasksCompletedOverTime(List<Task> tasks) {
        Map<LocalDate, Integer> completionMap = new TreeMap<>();
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysAgo = today.minusDays(29);

        // Initialize all dates with 0
        for (int i = 0; i < 30; i++) {
            completionMap.put(thirtyDaysAgo.plusDays(i), 0);
        }

        // Count completed tasks by date
        for (Task task : tasks) {
            if (task.getCompleted() && task.getUpdatedAt() != null) {
                LocalDate completionDate = task.getUpdatedAt().toLocalDate();
                if (!completionDate.isBefore(thirtyDaysAgo) && !completionDate.isAfter(today)) {
                    completionMap.put(completionDate, completionMap.getOrDefault(completionDate, 0) + 1);
                }
            }
        }

        return completionMap;
    }
}
