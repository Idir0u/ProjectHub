package com.projecthub.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for assigning a task to a user.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignTaskRequest {
    
    @NotNull(message = "User ID is required")
    private Long userId;
}
