package com.projecthub.dto;

import com.projecthub.model.TaskPriority;
import com.projecthub.model.TaskStatus;
import com.projecthub.model.RecurrencePattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for task response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private Boolean completed;
    private TaskStatus status;
    private TaskPriority priority;
    private RecurrencePattern recurrencePattern;
    private LocalDate recurrenceEndDate;
    private Long projectId;
    private Long assignedToId;
    private String assignedToEmail;
    private List<TagDTO> tags;
    private List<Long> dependsOnIds;
    private List<Long> blockedByIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
