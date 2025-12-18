package com.projecthub.model;

/**
 * Status of a project invitation.
 */
public enum InvitationStatus {
    /**
     * Invitation sent, awaiting response
     */
    PENDING,
    
    /**
     * Invitation accepted by user
     */
    ACCEPTED,
    
    /**
     * Invitation declined by user
     */
    DECLINED,
    
    /**
     * Invitation cancelled by sender
     */
    CANCELLED
}
