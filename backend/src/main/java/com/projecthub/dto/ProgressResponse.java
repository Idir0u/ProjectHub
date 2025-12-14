package com.projecthub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for project progress response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressResponse {

    private Long projectId;
    private Long totalTasks;
    private Long completedTasks;
    private Double progressPercentage;

    /**
     * Calculate and set progress percentage based on total and completed tasks.
     * Handles divide by zero scenario.
     */
    public void calculateProgress() {
        if (totalTasks == null || totalTasks == 0) {
            this.progressPercentage = 0.0;
        } else {
            this.progressPercentage = Math.round((completedTasks.doubleValue() / totalTasks.doubleValue()) * 100.0 * 100.0) / 100.0;
        }
    }
}
