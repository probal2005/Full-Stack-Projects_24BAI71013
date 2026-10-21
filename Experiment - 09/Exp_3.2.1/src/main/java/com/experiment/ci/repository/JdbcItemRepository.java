package com.experiment.ci.repository;

import com.experiment.ci.model.Item;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcItemRepository implements ItemRepository {
    private final JdbcTemplate jdbc;

    public JdbcItemRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Item save(String name) {
        KeyHolder holder = new GeneratedKeyHolder();

        jdbc.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(
                    "INSERT INTO items(name) VALUES (?)",
                    Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, name);
            return statement;
        }, holder);

        Number key = holder.getKey();
        if (key == null) {
            throw new IllegalStateException("Database did not return an ID");
        }
        return new Item(key.longValue(), name);
    }

    @Override
    public Optional<Item> findById(long id) {
        List<Item> result = jdbc.query(
                "SELECT id, name FROM items WHERE id = ?",
                (rs, row) -> new Item(rs.getLong("id"), rs.getString("name")),
                id);
        return result.stream().findFirst();
    }

    @Override
    public List<Item> findAll() {
        return jdbc.query(
                "SELECT id, name FROM items ORDER BY id",
                (rs, row) -> new Item(rs.getLong("id"), rs.getString("name")));
    }
}
