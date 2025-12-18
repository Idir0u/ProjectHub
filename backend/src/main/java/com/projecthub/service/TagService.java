package com.projecthub.service;

import com.projecthub.dto.CreateTagRequest;
import com.projecthub.dto.TagDTO;
import com.projecthub.exception.NotFoundException;
import com.projecthub.model.Project;
import com.projecthub.model.Tag;
import com.projecthub.repository.ProjectRepository;
import com.projecthub.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing tags.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TagService {

    private final TagRepository tagRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberService projectMemberService;

    /**
     * Create a new tag for a project.
     */
    @Transactional
    public TagDTO createTag(Long projectId, CreateTagRequest request, Long userId) {
        log.debug("Creating tag for project {}: {}", projectId, request.getName());

        // Verify user is a member
        if (!projectMemberService.isMember(projectId, userId)) {
            throw new IllegalArgumentException("You don't have access to this project");
        }

        // Check if tag already exists
        if (tagRepository.existsByNameAndProjectId(request.getName(), projectId)) {
            throw new IllegalArgumentException("Tag with this name already exists in this project");
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Project", "id", projectId));

        Tag tag = Tag.builder()
                .name(request.getName())
                .color(request.getColor())
                .project(project)
                .build();

        tag = tagRepository.save(tag);
        log.info("Tag created: {} for project {}", tag.getName(), projectId);

        return mapToDTO(tag);
    }

    /**
     * Get all tags for a project.
     */
    public List<TagDTO> getProjectTags(Long projectId, Long userId) {
        log.debug("Getting tags for project {}", projectId);

        // Verify user is a member
        if (!projectMemberService.isMember(projectId, userId)) {
            throw new IllegalArgumentException("You don't have access to this project");
        }

        return tagRepository.findByProjectId(projectId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Delete a tag.
     */
    @Transactional
    public void deleteTag(Long tagId, Long userId) {
        log.debug("Deleting tag {}", tagId);

        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new NotFoundException("Tag", "id", tagId));

        // Verify user is a member
        if (!projectMemberService.isMember(tag.getProject().getId(), userId)) {
            throw new IllegalArgumentException("You don't have access to this project");
        }

        tagRepository.delete(tag);
        log.info("Tag deleted: {}", tagId);
    }

    private TagDTO mapToDTO(Tag tag) {
        return TagDTO.builder()
                .id(tag.getId())
                .name(tag.getName())
                .color(tag.getColor())
                .projectId(tag.getProject().getId())
                .build();
    }
}
