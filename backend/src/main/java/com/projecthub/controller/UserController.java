package com.projecthub.controller;

import com.projecthub.dto.UserSearchDTO;
import com.projecthub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller for user search functionality.
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserRepository userRepository;

    /**
     * Search for users by email.
     * GET /users/search?email={query}
     */
    @GetMapping("/search")
    public ResponseEntity<List<UserSearchDTO>> searchUsers(
            @RequestParam(required = false) String email) {
        
        log.info("Searching users with email containing: {}", email);

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<UserSearchDTO> users = userRepository.findByEmailContainingIgnoreCase(email)
                .stream()
                .limit(10) // Limit results to avoid overwhelming UI
                .map(user -> UserSearchDTO.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }
}
