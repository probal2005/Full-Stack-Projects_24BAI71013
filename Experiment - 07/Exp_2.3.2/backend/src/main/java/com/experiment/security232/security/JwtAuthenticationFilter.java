package com.experiment.security232.security;

import com.experiment.security232.entity.User;
import com.experiment.security232.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorization =
                request.getHeader("Authorization");

        if (
                authorization == null
                        || !authorization.startsWith("Bearer ")
        ) {

            filterChain.doFilter(request, response);
            return;
        }

        String token =
                authorization.substring(7);

        try {

            if (jwtService.isValid(token)) {

                String username =
                        jwtService.extractUsername(token);

                if (
                        SecurityContextHolder
                                .getContext()
                                .getAuthentication() == null
                ) {

                    User user =
                            userRepository
                                    .findByUsername(username)
                                    .orElse(null);

                    if (user != null) {

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        user.getUsername(),
                                        null,
                                        List.of(
                                                new SimpleGrantedAuthority(
                                                        "ROLE_" + user.getRole()
                                                )
                                        )
                                );

                        SecurityContextHolder
                                .getContext()
                                .setAuthentication(authentication);
                    }
                }
            }

        } catch (Exception ignored) {
            // Invalid JWT is treated as unauthenticated.
        }

        filterChain.doFilter(request, response);
    }
}
