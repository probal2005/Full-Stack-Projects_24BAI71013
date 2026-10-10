package com.experiment.security232.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/security")
public class SecurityController {

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Protected security dashboard",
                        "username",
                        authentication.getName(),
                        "authentication",
                        "JWT Bearer token",
                        "encryption",
                        "AES-256-GCM",
                        "credentialStorage",
                        "Encrypted database storage",
                        "tokenStrategy",
                        "Short-lived access + rotating refresh tokens",
                        "serverTime",
                        Instant.now()
                )
        );
    }
}
