package com.experiment.security.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public Map<String, Object> profile(
            Authentication authentication
    ) {

        return Map.of(
                "message",
                "Authenticated user profile",
                "username",
                authentication.getName(),
                "authorities",
                authentication.getAuthorities()
        );
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public Map<String, String> dashboard(
            Authentication authentication
    ) {

        return Map.of(
                "title",
                "User Dashboard",
                "message",
                "Welcome " + authentication.getName()
        );
    }
}
