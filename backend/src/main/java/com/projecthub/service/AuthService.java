package com.projecthub.service;

import com.projecthub.dto.LoginRequest;
import com.projecthub.dto.LoginResponse;
import com.projecthub.dto.RegisterRequest;
import com.projecthub.exception.BadCredentialsException;
import com.projecthub.model.User;
import com.projecthub.repository.UserRepository;
import com.projecthub.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for handling authentication operations.
 * Manages user login, registration and JWT token generation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Register a new user.
     *
     * @param registerRequest registration details
     * @return LoginResponse with JWT token and user info
     * @throws IllegalArgumentException if email already exists
     */
    @Transactional
    public LoginResponse register(RegisterRequest registerRequest) {
        log.debug("Attempting registration for user: {}", registerRequest.getEmail());

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .build();

        user = userRepository.save(user);
        log.info("User registered successfully: {}", user.getEmail());

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        return new LoginResponse(token, user.getId(), user.getEmail());
    }

    /**
     * Authenticate user and return JWT token.
     *
     * @param loginRequest login credentials
     * @return LoginResponse with JWT token and user info
     * @throws BadCredentialsException if credentials are invalid
     */
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest loginRequest) {
        log.debug("Attempting login for user: {}", loginRequest.getEmail());

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            log.warn("Failed login attempt for user: {}", loginRequest.getEmail());
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        log.info("User logged in successfully: {}", user.getEmail());

        return new LoginResponse(token, user.getId(), user.getEmail());
    }

    /**
     * Initialize hardcoded users for demo purposes.
     * Creates two test users if they don't exist.
     * This would typically be done via database migration or admin panel.
     */
    @Transactional
    public void initializeUsers() {
        // User 1: admin@projecthub.com / admin123
        if (!userRepository.existsByEmail("admin@projecthub.com")) {
            User admin = User.builder()
                    .email("admin@projecthub.com")
                    .password(passwordEncoder.encode("admin123"))
                    .build();
            userRepository.save(admin);
            log.info("Created demo user: admin@projecthub.com");
        }

        // User 2: user@projecthub.com / user123
        if (!userRepository.existsByEmail("user@projecthub.com")) {
            User user = User.builder()
                    .email("user@projecthub.com")
                    .password(passwordEncoder.encode("user123"))
                    .build();
            userRepository.save(user);
            log.info("Created demo user: user@projecthub.com");
        }
    }
}
