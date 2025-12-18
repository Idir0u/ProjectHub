package com.projecthub.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for bulk task operations.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkTaskRequest {

    @NotEmpty(message = "Task IDs are required")
    private List<Long> taskIds;
}
