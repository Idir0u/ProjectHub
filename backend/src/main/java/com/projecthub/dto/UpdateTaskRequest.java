package com.projecthub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating task completion status.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTaskRequest {

    private Boolean completed;
}
