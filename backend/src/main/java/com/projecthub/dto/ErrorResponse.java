package com.projecthub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Generic error response DTO.
 */
@Data
@AllArgsConstructor
public class ErrorResponse {

    private int status;
    private String message;
    private String error;
    private long timestamp;

    public ErrorResponse(int status, String message, String error) {
        this.status = status;
        this.message = message;
        this.error = error;
        this.timestamp = System.currentTimeMillis();
    }
}
