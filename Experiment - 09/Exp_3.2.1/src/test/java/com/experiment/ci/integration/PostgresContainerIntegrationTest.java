package com.experiment.ci.integration;

import com.experiment.ci.model.Item;
import com.experiment.ci.repository.ItemRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers(disabledWithoutDocker = true)
class PostgresContainerIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16-alpine")
                    .withDatabaseName("citest")
                    .withUsername("ciuser")
                    .withPassword("cipassword");

    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.datasource.driver-class-name",
                () -> "org.postgresql.Driver");
    }

    @Autowired
    ItemRepository repository;

    @Test
    void savesAndReadsFromPostgres() {
        Item saved = repository.save("PostgreSQL Test");
        Item loaded = repository.findById(saved.id()).orElseThrow();

        assertEquals("PostgreSQL Test", loaded.name());
        assertEquals(saved.id(), loaded.id());
    }
}
