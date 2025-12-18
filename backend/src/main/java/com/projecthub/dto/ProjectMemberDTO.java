package com.projecthub.dto;

import com.projecthub.model.ProjectRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for project member information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMemberDTO {
    private Long id;
    private Long userId;
    private String userEmail;
    private ProjectRole role;
    private LocalDateTime joinedAt;
}
