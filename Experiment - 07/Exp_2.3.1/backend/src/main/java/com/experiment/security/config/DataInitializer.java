package com.experiment.security.config;

import com.experiment.security.entity.Role;
import com.experiment.security.entity.User;
import com.experiment.security.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeUsers(
            UserRepository repository,
            PasswordEncoder passwordEncoder
    ) {

        return args -> {

            if (!repository.existsByUsername("admin")) {

                repository.save(
                        new User(
                                "admin",
                                passwordEncoder.encode("admin123"),
                                Role.ADMIN
                        )
                );
            }

            if (!repository.existsByUsername("student")) {

                repository.save(
                        new User(
                                "student",
                                passwordEncoder.encode("student123"),
                                Role.USER
                        )
                );
            }
        };
    }
}
