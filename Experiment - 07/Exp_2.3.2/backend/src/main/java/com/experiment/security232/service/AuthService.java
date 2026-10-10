package com.experiment.security232.service;

import com.experiment.security232.dto.LoginRequest;
import com.experiment.security232.dto.RefreshRequest;
import com.experiment.security232.dto.RegisterRequest;
import com.experiment.security232.entity.RefreshToken;
import com.experiment.security232.entity.User;
import com.experiment.security232.repository.RefreshTokenRepository;
import com.experiment.security232.repository.UserRepository;
import com.experiment.security232.security.JwtService;
import com.experiment.security232.security.TokenHashService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenHashService tokenHashService;

    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(
            UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            TokenHashService tokenHashService
    ) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenHashService = tokenHashService;
    }

    public Map<String, Object> register(
            RegisterRequest request
    ) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException(
                    "Username already exists"
            );
        }

        User user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                "USER"
        );

        userRepository.save(user);

        return Map.of(
                "message",
                "Registration successful",
                "username",
                user.getUsername(),
                "role",
                user.getRole()
        );
    }

    @Transactional
    public Map<String, Object> login(
            LoginRequest request
    ) {

        User user =
                userRepository
                        .findByUsername(request.getUsername())
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Invalid username or password"
                                )
                        );

        if (
                !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                )
        ) {
            throw new IllegalArgumentException(
                    "Invalid username or password"
            );
        }

        return createTokenPair(user);
    }

    @Transactional
    public Map<String, Object> refresh(
            RefreshRequest request
    ) {

        String presentedToken =
                request.getRefreshToken();

        String tokenHash =
                tokenHashService.hash(presentedToken);

        RefreshToken storedToken =
                refreshTokenRepository
                        .findByTokenHash(tokenHash)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Invalid refresh token"
                                )
                        );

        if (storedToken.isRevoked()) {
            throw new IllegalArgumentException(
                    "Refresh token has already been revoked"
            );
        }

        if (
                storedToken
                        .getExpiresAt()
                        .isBefore(Instant.now())
        ) {
            storedToken.setRevoked(true);
            refreshTokenRepository.save(storedToken);

            throw new IllegalArgumentException(
                    "Refresh token has expired"
            );
        }

        User user =
                userRepository
                        .findByUsername(
                                storedToken.getUsername()
                        )
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "User no longer exists"
                                )
                        );

        // Rotation:
        // The old refresh token becomes unusable.
        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        return createTokenPair(user);
    }

    @Transactional
    public Map<String, Object> logout(
            RefreshRequest request
    ) {

        String tokenHash =
                tokenHashService.hash(
                        request.getRefreshToken()
                );

        refreshTokenRepository
                .findByTokenHash(tokenHash)
                .ifPresent(token -> {

                    token.setRevoked(true);

                    refreshTokenRepository.save(token);
                });

        return Map.of(
                "message",
                "Session revoked successfully"
        );
    }

    private Map<String, Object> createTokenPair(
            User user
    ) {

        String accessToken =
                jwtService.generateAccessToken(
                        user.getUsername(),
                        user.getRole()
                );

        String refreshToken =
                generateRefreshToken();

        RefreshToken entity =
                new RefreshToken(
                        tokenHashService.hash(refreshToken),
                        user.getUsername(),
                        Instant.now().plus(7, ChronoUnit.DAYS),
                        false,
                        Instant.now()
                );

        refreshTokenRepository.save(entity);

        return Map.of(
                "tokenType",
                "Bearer",
                "accessToken",
                accessToken,
                "refreshToken",
                refreshToken,
                "accessTokenExpiresIn",
                "15 minutes",
                "refreshTokenExpiresIn",
                "7 days",
                "username",
                user.getUsername(),
                "role",
                user.getRole()
        );
    }

    private String generateRefreshToken() {

        byte[] bytes = new byte[48];

        secureRandom.nextBytes(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }
}
