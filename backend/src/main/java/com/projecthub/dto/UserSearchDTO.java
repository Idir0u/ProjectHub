package com.projecthub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user search results.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchDTO {
    private Long id;
    private String email;
}
