package com.projecthub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for joining a project via invite code.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JoinProjectRequest {
    
    @NotBlank(message = "Invite code is required")
    private String inviteCode;
}
