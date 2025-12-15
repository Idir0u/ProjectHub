package com.projecthub.controller;

import com.projecthub.dto.UserStatsResponse;
import com.projecthub.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StatsController {

    private final StatsService statsService;

    @GetMapping
    public ResponseEntity<UserStatsResponse> getUserStatistics(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        UserStatsResponse stats = statsService.getUserStatistics(userId);
        return ResponseEntity.ok(stats);
    }
}
