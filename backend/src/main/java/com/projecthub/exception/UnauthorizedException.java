package com.projecthub.exception;

/**
 * Exception thrown when user is not authorized to access a resource.
 * Results in 403 HTTP status.
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
