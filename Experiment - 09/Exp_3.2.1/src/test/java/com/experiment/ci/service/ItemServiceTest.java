package com.experiment.ci.service;

import com.experiment.ci.model.Item;
import com.experiment.ci.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItemServiceTest {
    @Mock
    ItemRepository repository;

    ItemService service;

    @BeforeEach
    void setUp() {
        service = new ItemService(repository);
    }

    @Test
    void createsItemAndTrimsName() {
        when(repository.save("Keyboard")).thenReturn(new Item(1L, "Keyboard"));

        assertEquals(new Item(1L, "Keyboard"), service.createItem(" Keyboard "));
        verify(repository).save("Keyboard");
    }

    @Test
    void rejectsBlankName() {
        assertThrows(IllegalArgumentException.class, () -> service.createItem(" "));
        verifyNoInteractions(repository);
    }

    @Test
    void findsExistingItem() {
        when(repository.findById(7L)).thenReturn(Optional.of(new Item(7L, "Mouse")));

        assertEquals(Optional.of(new Item(7L, "Mouse")), service.findItem(7L));
    }
}
