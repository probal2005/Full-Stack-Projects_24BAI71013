package com.experiment.ci.service;

import com.experiment.ci.model.Item;
import com.experiment.ci.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {
    private final ItemRepository repository;

    public ItemService(ItemRepository repository) {
        this.repository = repository;
    }

    public Item createItem(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Item name must not be blank");
        }
        return repository.save(name.trim());
    }

    public Optional<Item> findItem(long id) {
        return repository.findById(id);
    }

    public List<Item> findAllItems() {
        return repository.findAll();
    }
}
