package com.projecthub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private Long projectId;
    private Long assignedToId;
    private String assignedToEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
