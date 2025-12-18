package com.projecthub.dto;

import com.projecthub.model.ProjectRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for adding a member to a project.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddMemberRequest {
    
    @NotNull(message = "User email is required")
    @Email(message = "Invalid email format")
    private String userEmail;
    
    @NotNull(message = "Role is required")
    private ProjectRole role;
}
