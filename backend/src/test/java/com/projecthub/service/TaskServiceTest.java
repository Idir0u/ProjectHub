package com.projecthub.service;

import com.projecthub.dto.TaskResponse;
import com.projecthub.model.*;
import com.projecthub.repository.TaskRepository;
import com.projecthub.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectMemberService projectMemberService;

    @InjectMocks
    private TaskService taskService;

    private Task testTask;
    private User testUser;
    private User assignedUser;
    private User thirdUser;
    private Project testProject;

    @BeforeEach
    void setUp() {
        // Setup users
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");

        assignedUser = new User();
        assignedUser.setId(2L);
        assignedUser.setEmail("assigned@example.com");

        thirdUser = new User();
        thirdUser.setId(3L);
        thirdUser.setEmail("third@example.com");

        // Setup project
        testProject = new Project();
        testProject.setId(1L);
        testProject.setTitle("Test Project");
        testProject.setDescription("Test Description");

        // Setup task
        testTask = Task.builder()
                .id(1L)
                .title("Test Task")
                .description("Test Description")
                .completed(false)
                .status(TaskStatus.TODO)
                .priority(TaskPriority.MEDIUM)
                .project(testProject)
                .tags(new HashSet<>())
                .dependsOn(new HashSet<>())
                .blockedBy(new HashSet<>())
                .build();
    }

    @Test
    void testUpdateTaskStatus_AsAssignedUser_Success() {
        // Given: user 2 is assigned to the task
        testTask.setAssignedTo(assignedUser);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(projectMemberService.isMember(1L, 2L)).thenReturn(true);
        when(projectMemberService.isOwner(1L, 2L)).thenReturn(false);
        when(projectMemberService.isAdmin(1L, 2L)).thenReturn(false);
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When: assigned user updates status
        TaskResponse response = taskService.updateTaskStatus(1L, TaskStatus.IN_PROGRESS, 2L);

        // Then: task status updated
        verify(taskRepository, times(1)).save(any(Task.class));
        assertEquals(TaskStatus.IN_PROGRESS, testTask.getStatus());
        assertNotNull(response);
    }

    @Test
    void testUpdateTaskStatus_AsOwner_Success() {
        // Given: user 1 is owner
        testTask.setAssignedTo(assignedUser);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(projectMemberService.isMember(1L, 1L)).thenReturn(true);
        when(projectMemberService.isOwner(1L, 1L)).thenReturn(true);
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When: owner updates status to DONE
        TaskResponse response = taskService.updateTaskStatus(1L, TaskStatus.DONE, 1L);

        // Then: task completed and status updated
        verify(taskRepository, times(1)).save(any(Task.class));
        assertEquals(TaskStatus.DONE, testTask.getStatus());
        assertTrue(testTask.getCompleted());
        assertNotNull(response);
    }

    @Test
    void testUpdateTaskStatus_AsAdmin_Success() {
        // Given: user 3 is admin
        testTask.setAssignedTo(assignedUser);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(projectMemberService.isMember(1L, 3L)).thenReturn(true);
        when(projectMemberService.isOwner(1L, 3L)).thenReturn(false);
        when(projectMemberService.isAdmin(1L, 3L)).thenReturn(true);
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When: admin updates status
        TaskResponse response = taskService.updateTaskStatus(1L, TaskStatus.DONE, 3L);

        // Then: task updated
        verify(taskRepository, times(1)).save(any(Task.class));
        assertEquals(TaskStatus.DONE, testTask.getStatus());
        assertNotNull(response);
    }

    @Test
    void testUpdateTaskStatus_UnauthorizedUser_ThrowsException() {
        // Given: user 3 is not assigned, owner, or admin
        testTask.setAssignedTo(assignedUser);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(projectMemberService.isMember(1L, 3L)).thenReturn(true);
        when(projectMemberService.isOwner(1L, 3L)).thenReturn(false);
        when(projectMemberService.isAdmin(1L, 3L)).thenReturn(false);

        // When & Then: should throw exception
        assertThrows(IllegalArgumentException.class, () -> {
            taskService.updateTaskStatus(1L, TaskStatus.DONE, 3L);
        });

        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void testUpdateTaskStatus_MoveToDone_AutoCompletes() {
        // Given: task in TODO status
        testTask.setAssignedTo(assignedUser);
        testTask.setCompleted(false);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(projectMemberService.isMember(1L, 2L)).thenReturn(true);
        when(projectMemberService.isOwner(1L, 2L)).thenReturn(false);
        when(projectMemberService.isAdmin(1L, 2L)).thenReturn(false);
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When: move to DONE
        taskService.updateTaskStatus(1L, TaskStatus.DONE, 2L);

        // Then: automatically marked as completed
        assertTrue(testTask.getCompleted());
        assertEquals(TaskStatus.DONE, testTask.getStatus());
    }

    @Test
    void testUpdateTaskStatus_MoveFromDone_AutoUncompletes() {
        // Given: task in DONE status and completed
        testTask.setAssignedTo(assignedUser);
        testTask.setCompleted(true);
        testTask.setStatus(TaskStatus.DONE);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(projectMemberService.isMember(1L, 2L)).thenReturn(true);
        when(projectMemberService.isOwner(1L, 2L)).thenReturn(false);
        when(projectMemberService.isAdmin(1L, 2L)).thenReturn(false);
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When: move back to IN_PROGRESS
        taskService.updateTaskStatus(1L, TaskStatus.IN_PROGRESS, 2L);

        // Then: automatically unmarked as completed
        assertFalse(testTask.getCompleted());
        assertEquals(TaskStatus.IN_PROGRESS, testTask.getStatus());
    }

    @Test
    void testAssignTask_Success() {
        // Given: both users are members
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(projectMemberService.isMember(1L, 1L)).thenReturn(true);
        when(projectMemberService.isMember(1L, 2L)).thenReturn(true);
        when(userRepository.findById(2L)).thenReturn(Optional.of(assignedUser));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When: assign task
        TaskResponse response = taskService.assignTask(1L, 2L, 1L);

        // Then: task assigned
        verify(taskRepository, times(1)).save(any(Task.class));
        assertEquals(assignedUser, testTask.getAssignedTo());
        assertNotNull(response);
    }

    @Test
    void testUnassignTask_Success() {
        // Given: task has assigned user
        testTask.setAssignedTo(assignedUser);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(projectMemberService.isMember(1L, 1L)).thenReturn(true);
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When: unassign task
        TaskResponse response = taskService.unassignTask(1L, 1L);

        // Then: assignment removed
        verify(taskRepository, times(1)).save(any(Task.class));
        assertNull(testTask.getAssignedTo());
        assertNotNull(response);
    }

    @Test
    void testDeleteTask_Success() {
        // Given: task exists and belongs to user
        when(taskRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testTask));
        doNothing().when(taskRepository).delete(any(Task.class));

        // When: delete task
        taskService.deleteTask(1L, 1L);

        // Then: task deleted
        verify(taskRepository, times(1)).delete(testTask);
    }
}
