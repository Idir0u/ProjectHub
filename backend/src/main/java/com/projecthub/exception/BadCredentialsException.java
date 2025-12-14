package com.projecthub.exception;

/**
 * Exception thrown when authentication credentials are invalid.
 * Results in 401 HTTP status.
 */
public class BadCredentialsException extends RuntimeException {

    public BadCredentialsException(String message) {
        super(message);
    }
}
