package com.projecthub.config;

import com.projecthub.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Initializes demo users on application startup.
 * Creates hardcoded users for testing purposes.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AuthService authService;

    @Override
    public void run(String... args) {
        log.info("Initializing demo users...");
        authService.initializeUsers();
        log.info("Demo users initialized successfully");
        log.info("Available test users:");
        log.info("  - Email: admin@projecthub.com | Password: admin123");
        log.info("  - Email: user@projecthub.com  | Password: user123");
    }
}
