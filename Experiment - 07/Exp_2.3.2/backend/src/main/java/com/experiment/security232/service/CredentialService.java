package com.experiment.security232.service;

import com.experiment.security232.dto.CredentialRequest;
import com.experiment.security232.entity.EncryptedCredential;
import com.experiment.security232.repository.EncryptedCredentialRepository;
import com.experiment.security232.security.AesEncryptionService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class CredentialService {

    private final EncryptedCredentialRepository repository;
    private final AesEncryptionService encryptionService;

    public CredentialService(
            EncryptedCredentialRepository repository,
            AesEncryptionService encryptionService
    ) {
        this.repository = repository;
        this.encryptionService = encryptionService;
    }

    public Map<String, Object> save(
            String username,
            CredentialRequest request
    ) {

        Instant now = Instant.now();

        EncryptedCredential credential =
                new EncryptedCredential();

        credential.setProvider(request.getProvider());
        credential.setUsername(username);

        credential.setEncryptedClientId(
                encryptionService.encrypt(
                        request.getClientId()
                )
        );

        credential.setEncryptedClientSecret(
                encryptionService.encrypt(
                        request.getClientSecret()
                )
        );

        credential.setEncryptedAccessToken(
                encryptionService.encrypt(
                        request.getAccessToken()
                )
        );

        credential.setEncryptedRefreshToken(
                encryptionService.encrypt(
                        request.getRefreshToken()
                )
        );

        credential.setCreatedAt(now);
        credential.setUpdatedAt(now);

        repository.save(credential);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put(
                "message",
                "OAuth credentials encrypted and stored successfully"
        );
        response.put("id", credential.getId());
        response.put("provider", credential.getProvider());

        return response;
    }

    public List<Map<String, Object>> list(
            String username
    ) {

        List<Map<String, Object>> result = new ArrayList<>();

        repository
                .findByUsernameOrderByCreatedAtDesc(username)
                .forEach(credential -> {

                    Map<String, Object> item =
                            new LinkedHashMap<>();

                    item.put(
                            "id",
                            credential.getId()
                    );

                    item.put(
                            "provider",
                            credential.getProvider()
                    );

                    item.put(
                            "storedAs",
                            "AES-256-GCM encrypted"
                    );

                    item.put(
                            "clientId",
                            mask(
                                    encryptionService.decrypt(
                                            credential.getEncryptedClientId()
                                    )
                            )
                    );

                    item.put(
                            "clientSecret",
                            "••••••••••••"
                    );

                    item.put(
                            "accessToken",
                            "••••••••••••"
                    );

                    item.put(
                            "refreshToken",
                            "••••••••••••"
                    );

                    item.put(
                            "createdAt",
                            credential.getCreatedAt()
                    );

                    result.add(item);
                });

        return result;
    }

    private String mask(String value) {

        if (value == null || value.length() <= 4) {
            return "••••";
        }

        return value.substring(0, 2)
                + "••••••••"
                + value.substring(value.length() - 2);
    }
}
