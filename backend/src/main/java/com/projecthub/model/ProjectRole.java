package com.projecthub.model;

/**
 * Enum representing roles a user can have in a project.
 * Determines what actions a member can perform.
 */
public enum ProjectRole {
    /**
     * Project owner - full control, can delete project, manage all members
     */
    OWNER,
    
    /**
     * Project admin - can manage members and tasks, cannot delete project
     */
    ADMIN,
    
    /**
     * Regular member - can view project and complete assigned tasks
     */
    MEMBER
}
