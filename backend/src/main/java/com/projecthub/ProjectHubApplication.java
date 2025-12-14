package com.projecthub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for ProjectHub backend.
 * This Spring Boot application provides REST APIs for task management
 * with user authentication, projects, and tasks.
 */
@SpringBootApplication
public class ProjectHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectHubApplication.class, args);
    }
}
