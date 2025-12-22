package com.projecthub.service;

import com.projecthub.model.Project;
import com.projecthub.model.ProjectMember;
import com.projecthub.model.ProjectRole;
import com.projecthub.model.User;
import com.projecthub.repository.ProjectMemberRepository;
import com.projecthub.repository.ProjectRepository;
import com.projecthub.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectMemberServiceTest {

    @Mock
    private ProjectMemberRepository projectMemberRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProjectMemberService projectMemberService;

    private Project testProject;
    private User testUser;
    private ProjectMember testMember;

    @BeforeEach
    void setUp() {
        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");

        // Setup test project  
        testProject = new Project();
        testProject.setId(1L);
        testProject.setTitle("Test Project");
        testProject.setDescription("Test project description");

        // Setup test member as owner
        testMember = new ProjectMember();
        testMember.setId(1L);
        testMember.setProject(testProject);
        testMember.setUser(testUser);
        testMember.setRole(ProjectRole.OWNER);
    }

    @Test
    void testAddCreatorAsOwner() {
        // Given
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(projectMemberRepository.save(any(ProjectMember.class))).thenReturn(testMember);

        // When
        projectMemberService.addCreatorAsOwner(1L, 1L);

        // Then
        verify(projectMemberRepository, times(1)).save(any(ProjectMember.class));
    }

    @Test
    void testIsOwner_ReturnsTrue_WhenUserIsOwner() {
        // Given
        when(projectMemberRepository.findByProjectIdAndUserId(1L, 1L))
                .thenReturn(Optional.of(testMember));

        // When
        boolean result = projectMemberService.isOwner(1L, 1L);

        // Then
        assertTrue(result);
    }

    @Test
    void testIsOwner_ReturnsFalse_WhenUserIsNotOwner() {
        // Given: member with MEMBER role
        testMember.setRole(ProjectRole.MEMBER);
        when(projectMemberRepository.findByProjectIdAndUserId(1L, 1L))
                .thenReturn(Optional.of(testMember));

        // When
        boolean result = projectMemberService.isOwner(1L, 1L);

        // Then
        assertFalse(result);
    }

    @Test
    void testIsOwner_ReturnsFalse_WhenMemberNotFound() {
        // Given: no member found
        when(projectMemberRepository.findByProjectIdAndUserId(1L, 1L))
                .thenReturn(Optional.empty());

        // When
        boolean result = projectMemberService.isOwner(1L, 1L);

        // Then
        assertFalse(result);
    }

    @Test
    void testIsAdmin_ReturnsTrue_WhenUserIsAdmin() {
        // Given: member with ADMIN role
        testMember.setRole(ProjectRole.ADMIN);
        when(projectMemberRepository.findByProjectIdAndUserId(1L, 1L))
                .thenReturn(Optional.of(testMember));

        // When
        boolean result = projectMemberService.isAdmin(1L, 1L);

        // Then
        assertTrue(result);
    }

    @Test
    void testIsAdmin_ReturnsFalse_WhenUserIsNotAdmin() {
        // Given: member with MEMBER role
        testMember.setRole(ProjectRole.MEMBER);
        when(projectMemberRepository.findByProjectIdAndUserId(1L, 1L))
                .thenReturn(Optional.of(testMember));

        // When
        boolean result = projectMemberService.isAdmin(1L, 1L);

        // Then
        assertFalse(result);
    }

    @Test
    void testIsAdmin_ReturnsFalse_WhenMemberNotFound() {
        // Given: no member found
        when(projectMemberRepository.findByProjectIdAndUserId(1L, 1L))
                .thenReturn(Optional.empty());

        // When
        boolean result = projectMemberService.isAdmin(1L, 1L);

        // Then
        assertFalse(result);
    }

    @Test
    void testIsMember_ReturnsTrue_WhenUserIsMember() {
        // Given: user is member of project
        when(projectMemberRepository.existsByProjectIdAndUserId(1L, 1L))
                .thenReturn(true);

        // When
        boolean result = projectMemberService.isMember(1L, 1L);

        // Then
        assertTrue(result);
    }

    @Test
    void testIsMember_ReturnsFalse_WhenUserIsNotMember() {
        // Given: user is not member of project
        when(projectMemberRepository.existsByProjectIdAndUserId(1L, 1L))
                .thenReturn(false);

        // When
        boolean result = projectMemberService.isMember(1L, 1L);

        // Then
        assertFalse(result);
    }
}
