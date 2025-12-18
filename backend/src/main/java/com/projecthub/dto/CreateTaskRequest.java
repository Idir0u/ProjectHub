package com.projecthub.dto;

import com.projecthub.model.TaskPriority;
import com.projecthub.model.RecurrencePattern;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO for creating a new task.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private LocalDate dueDate;

    private TaskPriority priority;

    private RecurrencePattern recurrencePattern;

    private LocalDate recurrenceEndDate;

    private List<Long> tagIds;

    private List<Long> dependsOnIds;
}
