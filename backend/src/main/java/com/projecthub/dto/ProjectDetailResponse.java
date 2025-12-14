package com.projecthub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for project detail response (with tasks).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDetailResponse {

    private Long id;
    private String title;
    private String description;
    private Long userId;
    private List<TaskResponse> tasks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
