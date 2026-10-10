package com.experiment.security232.controller;

import com.experiment.security232.dto.CredentialRequest;
import com.experiment.security232.service.CredentialService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/credentials")
public class CredentialController {

    private final CredentialService credentialService;

    public CredentialController(
            CredentialService credentialService
    ) {
        this.credentialService = credentialService;
    }

    @PostMapping
    public ResponseEntity<?> saveCredential(
            Authentication authentication,
            @Valid @RequestBody CredentialRequest request
    ) {

        return ResponseEntity.ok(
                credentialService.save(
                        authentication.getName(),
                        request
                )
        );
    }

    @GetMapping
    public ResponseEntity<?> listCredentials(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                credentialService.list(
                        authentication.getName()
                )
        );
    }
}
