package com.experiment.security232.controller;

import com.experiment.security232.dto.LoginRequest;
import com.experiment.security232.dto.RefreshRequest;
import com.experiment.security232.dto.RegisterRequest;
import com.experiment.security232.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        try {

            return ResponseEntity.ok(
                    authService.register(request)
            );

        } catch (IllegalArgumentException exception) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            exception.getMessage()
                    )
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request
    ) {

        try {

            return ResponseEntity.ok(
                    authService.login(request)
            );

        } catch (IllegalArgumentException exception) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    exception.getMessage()
                            )
                    );
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @Valid @RequestBody RefreshRequest request
    ) {

        try {

            return ResponseEntity.ok(
                    authService.refresh(request)
            );

        } catch (IllegalArgumentException exception) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    exception.getMessage()
                            )
                    );
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @Valid @RequestBody RefreshRequest request
    ) {

        return ResponseEntity.ok(
                authService.logout(request)
        );
    }
}
