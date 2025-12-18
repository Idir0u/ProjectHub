package com.projecthub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for tag response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TagDTO {
    private Long id;
    private String name;
    private String color;
    private Long projectId;
}
