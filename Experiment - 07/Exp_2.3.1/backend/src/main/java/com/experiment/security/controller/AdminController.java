package com.experiment.security.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, String> dashboard(
            Authentication authentication
    ) {

        return Map.of(
                "title",
                "Admin Dashboard",
                "message",
                "Welcome administrator " +
                        authentication.getName()
        );
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> users() {

        return Map.of(
                "message",
                "Admin-only user management endpoint",
                "access",
                "ADMIN"
        );
    }

    @DeleteMapping("/system")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, String> systemAction() {

        return Map.of(
                "status",
                "success",
                "message",
                "Admin system action executed"
        );
    }
}
