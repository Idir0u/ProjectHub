package com.projecthub.dto;

import com.projecthub.model.InvitationStatus;
import com.projecthub.model.ProjectRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for project invitation information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvitationDTO {
    private Long id;
    private Long projectId;
    private String projectTitle;
    private Long inviteeId;
    private String inviteeEmail;
    private Long inviterId;
    private String inviterEmail;
    private ProjectRole role;
    private InvitationStatus status;
    private LocalDateTime invitedAt;
    private LocalDateTime respondedAt;
}
