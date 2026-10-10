package com.experiment.security232.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long accessTokenExpiration;

    public JwtService(
            @Value("${security.jwt-secret}") String jwtSecret,
            @Value("${security.access-token-expiration-ms}") long accessTokenExpiration
    ) {
        this.secretKey = Keys.hmacShaKeyFor(
                jwtSecret.getBytes(StandardCharsets.UTF_8)
        );

        this.accessTokenExpiration = accessTokenExpiration;
    }

    public String generateAccessToken(
            String username,
            String role
    ) {

        Date now = new Date();

        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(now)
                .expiration(
                        new Date(
                                now.getTime()
                                        + accessTokenExpiration
                        )
                )
                .signWith(secretKey)
                .compact();
    }

    public String extractUsername(String token) {

        return parseClaims(token)
                .getSubject();
    }

    public boolean isValid(String token) {

        try {

            Claims claims = parseClaims(token);

            return claims.getExpiration()
                    .after(new Date());

        } catch (Exception exception) {

            return false;
        }
    }

    private Claims parseClaims(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
