package com.experiment.ci.controller;

import com.experiment.ci.model.Item;
import com.experiment.ci.service.ItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
public class ItemController {
    private final ItemService service;

    public ItemController(ItemService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Item> create(@RequestBody Map<String, String> request) {
        try {
            Item item = service.createItem(request.get("name"));
            return ResponseEntity.status(HttpStatus.CREATED).body(item);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    exception.getMessage());
        }
    }

    @GetMapping("/{id}")
    public Item get(@PathVariable long id) {
        return service.findItem(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Item not found"));
    }

    @GetMapping
    public List<Item> getAll() {
        return service.findAllItems();
    }
}
