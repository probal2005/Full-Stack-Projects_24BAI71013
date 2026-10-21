package com.experiment.kafkareliability.service;

import com.experiment.kafkareliability.model.PostEvent;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class EventTrackingService {

    private final JdbcTemplate jdbc;

    public EventTrackingService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public boolean isProcessed(String eventId) {
        Integer count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM processed_events " +
                        "WHERE event_id = ? AND status = 'PROCESSED'",
                Integer.class, eventId);
        return count != null && count > 0;
    }

    @Transactional
    public boolean processEvent(PostEvent event) {
        try {
            jdbc.update(
                    "INSERT INTO processed_events (event_id, status) " +
                            "VALUES (?, 'PROCESSING')",
                    event.getEventId());
        } catch (DuplicateKeyException exception) {
            log(event, "DUPLICATE",
                    "Event already claimed or processed; duplicate ignored.", 0);
            return false;
        }

        // Simulate a processing failure for retry/DLQ demonstrations.
        // The transaction rolls back so a retry can attempt the event again.
        if (event.isSimulateFailure()) {
            throw new IllegalStateException(
                    "Simulated processing failure requested for this event.");
        }

        if (event.getContent() == null || event.getContent().isBlank()) {
            throw new IllegalArgumentException("Post content cannot be empty.");
        }

        jdbc.update(
                "UPDATE processed_events SET status = 'PROCESSED', " +
                        "processed_at = CURRENT_TIMESTAMP WHERE event_id = ?",
                event.getEventId());

        log(event, "PROCESSED", "Post processed successfully.", 0);
        return true;
    }

    public void log(PostEvent event, String status,
                    String message, int attemptCount) {
        jdbc.update(
                "INSERT INTO event_logs " +
                        "(event_id, event_type, status, message, attempt_count) " +
                        "VALUES (?, 'SCHEDULED_POST', ?, ?, ?)",
                event.getEventId(), status, truncate(message, 2000), attemptCount);
    }

    public List<Map<String, Object>> getRecentEvents(int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 200));
        return jdbc.queryForList(
                "SELECT id, event_id, event_type, status, message, " +
                        "attempt_count, created_at FROM event_logs " +
                        "ORDER BY id DESC LIMIT ?", safeLimit);
    }

    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalEvents", count(
                "SELECT COUNT(DISTINCT event_id) FROM event_logs"));
        stats.put("processed", count(
                "SELECT COUNT(*) FROM processed_events WHERE status = 'PROCESSED'"));
        stats.put("retries", count(
                "SELECT COUNT(*) FROM event_logs WHERE status = 'RETRYING'"));
        stats.put("deadLetter", count(
                "SELECT COUNT(DISTINCT event_id) FROM event_logs WHERE status = 'DLQ'"));
        stats.put("duplicates", count(
                "SELECT COUNT(*) FROM event_logs WHERE status = 'DUPLICATE'"));
        stats.put("failed", count(
                "SELECT COUNT(DISTINCT event_id) FROM event_logs WHERE status = 'FAILED'"));
        return stats;
    }

    private long count(String sql) {
        Long value = jdbc.queryForObject(sql, Long.class);
        return value == null ? 0 : value;
    }

    private String truncate(String value, int maxLength) {
        if (value == null) return "";
        return value.length() <= maxLength
                ? value : value.substring(0, maxLength);
    }
}
