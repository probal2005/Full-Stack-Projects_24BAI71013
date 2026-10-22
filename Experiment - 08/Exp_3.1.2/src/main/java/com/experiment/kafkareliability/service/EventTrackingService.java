package com.experiment.kafkareliability.service;

import com.experiment.kafkareliability.model.EventMessage;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class EventTrackingService {
    private final Map<String, Map<String, Object>> events = new ConcurrentHashMap<>();
    private final Map<String, EventMessage> messages = new ConcurrentHashMap<>();
    private final Map<String, Integer> attempts = new ConcurrentHashMap<>();
    private final Map<String, Boolean> processedIds = new ConcurrentHashMap<>();

    private final AtomicLong published = new AtomicLong();
    private final AtomicLong processed = new AtomicLong();
    private final AtomicLong retryCount = new AtomicLong();
    private final AtomicLong deadLetter = new AtomicLong();
    private final AtomicLong duplicates = new AtomicLong();

    public synchronized void register(EventMessage event) {
        messages.put(event.getEventId(), event);
        Map<String, Object> row = events.computeIfAbsent(event.getEventId(), id -> {
            Map<String, Object> value = new LinkedHashMap<>();
            value.put("eventId", id);
            value.put("content", event.getContent());
            value.put("createdAt", event.getCreatedAt());
            value.put("attempts", 0);
            value.put("status", "PUBLISHED");
            value.put("detail", "Waiting for Kafka consumer");
            return value;
        });
        row.put("content", event.getContent());
        row.put("status", "PUBLISHED");
        row.put("detail", "Published to Kafka");
        published.incrementAndGet();
    }

    public synchronized int recordAttempt(String id) {
        int count = attempts.merge(id, 1, Integer::sum);
        update(id, "PROCESSING", "Processing attempt " + count, count);
        return count;
    }

    public synchronized void markRetry(String id, String detail) {
        retryCount.incrementAndGet();
        update(id, "RETRYING", detail, attempts.getOrDefault(id, 0));
    }

    public boolean hasProcessed(String id) {
        return processedIds.containsKey(id);
    }

    public synchronized boolean markProcessedOnce(String id) {
        if (processedIds.putIfAbsent(id, true) != null) {
            duplicates.incrementAndGet();
            update(id, "DUPLICATE", "Duplicate delivery ignored; already processed", attempts.getOrDefault(id, 0));
            return false;
        }
        processed.incrementAndGet();
        update(id, "PROCESSED", "Event processed successfully", attempts.getOrDefault(id, 0));
        return true;
    }

    public synchronized void markDuplicate(String id) {
        duplicates.incrementAndGet();
        update(id, "DUPLICATE", "Duplicate delivery ignored; no repeated processing", attempts.getOrDefault(id, 0));
    }

    public synchronized void markDeadLetter(EventMessage event) {
        deadLetter.incrementAndGet();
        registerIfMissing(event);
        update(event.getEventId(), "DLQ", "Retries exhausted; routed to dead-letter topic", attempts.getOrDefault(event.getEventId(), 0));
    }

    private void registerIfMissing(EventMessage event) {
        messages.putIfAbsent(event.getEventId(), event);
        events.computeIfAbsent(event.getEventId(), id -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("eventId", id);
            row.put("content", event.getContent());
            row.put("createdAt", event.getCreatedAt());
            row.put("attempts", attempts.getOrDefault(id, 0));
            row.put("status", "DLQ");
            row.put("detail", "Retries exhausted");
            return row;
        });
    }

    private void update(String id, String status, String detail, int count) {
        Map<String, Object> row = events.computeIfAbsent(id, key -> {
            Map<String, Object> value = new LinkedHashMap<>();
            value.put("eventId", key);
            value.put("createdAt", Instant.now().toString());
            return value;
        });
        row.put("status", status);
        row.put("detail", detail);
        row.put("attempts", count);
        row.put("updatedAt", Instant.now().toString());
    }

    public EventMessage findMessage(String id) {
        return messages.get(id);
    }

    public List<Map<String, Object>> recentEvents(int limit) {
        List<Map<String, Object>> result = new ArrayList<>(events.values());
        result.sort(Comparator.<Map<String, Object>, String>comparing(
            row -> String.valueOf(row.getOrDefault("updatedAt", row.getOrDefault("createdAt", "")))
        ).reversed());
        return result.subList(0, Math.min(Math.max(limit, 1), result.size()));
    }

    public Map<String, Object> statistics() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalPublished", published.get());
        stats.put("processed", processed.get());
        stats.put("retries", retryCount.get());
        stats.put("deadLetter", deadLetter.get());
        stats.put("duplicates", duplicates.get());
        stats.put("trackedEvents", events.size());
        return stats;
    }
}
