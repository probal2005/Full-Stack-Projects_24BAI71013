package com.experiment.ci.repository;

import com.experiment.ci.model.Item;
import java.util.List;
import java.util.Optional;

public interface ItemRepository {
    Item save(String name);
    Optional<Item> findById(long id);
    List<Item> findAll();
}
