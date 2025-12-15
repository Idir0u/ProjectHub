package com.projecthub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsResponse {
    private int totalProjects;
    private int totalTasks;
    private int completedTasks;
    private int activeTasks;
    private double completionRate;
    private Map<String, Integer> projectsProgress;
    private List<RecentActivity> recentActivities;
    private Map<LocalDate, Integer> tasksCompletedOverTime;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivity {
        private String type; // "PROJECT_CREATED", "TASK_COMPLETED", "TASK_CREATED"
        private String description;
        private String projectName;
        private String timestamp;
    }
}
