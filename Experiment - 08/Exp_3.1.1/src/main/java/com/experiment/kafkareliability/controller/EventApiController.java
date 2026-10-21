package com.experiment.kafkareliability.controller;

import com.experiment.kafkareliability.dto.EventRequest;
import com.experiment.kafkareliability.messaging.PostEventProducer;
import com.experiment.kafkareliability.model.PostEvent;
import com.experiment.kafkareliability.service.EventTrackingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class EventApiController {

    private final PostEventProducer producer;
    private final EventTrackingService trackingService;

    public EventApiController(
            PostEventProducer producer,
            EventTrackingService trackingService) {
        this.producer = producer;
        this.trackingService = trackingService;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", "UP");
        result.put("service", "Kafka Reliability Lab");
        result.put("experiment", "3.1.1");
        result.put("timestamp", Instant.now().toString());
        return result;
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        return trackingService.getStatistics();
    }

    @GetMapping("/events")
    public Map<String, Object> events(
            @RequestParam(defaultValue = "50") int limit) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("events", trackingService.getRecentEvents(limit));
        result.put("stats", trackingService.getStatistics());
        return result;
    }

    @PostMapping("/events")
    public ResponseEntity<?> publish(@RequestBody EventRequest request) {
        if (request.getContent() == null ||
                request.getContent().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Post content cannot be empty."));
        }

        if (request.getContent().length() > 2000) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Post content must not exceed 2000 characters."));
        }

        String scheduledAt = request.getScheduledAt() == null
                ? Instant.now().toString()
                : request.getScheduledAt().toString();

        PostEvent event = producer.publish(
                request.getContent().trim(),
                scheduledAt,
                request.isSimulateFailure());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Event submitted to Kafka.");
        response.put("eventId", event.getEventId());
        response.put("status", "PUBLISHED");
        response.put("event", event);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    @PostMapping("/events/{id}/retry")
    public ResponseEntity<?> retry(
            @PathVariable String id,
            @RequestBody EventRequest request) {
        if (request.getContent() == null ||
                request.getContent().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Content is required for manual replay."));
        }

        PostEvent event = new PostEvent(
                id,
                request.getContent().trim(),
                request.getScheduledAt() == null
                        ? Instant.now().toString()
                        : request.getScheduledAt().toString(),
                request.isSimulateFailure(),
                Instant.now());

        producer.republish(event);

        return ResponseEntity.accepted().body(Map.of(
                "message", "Event submitted for manual replay.",
                "eventId", id,
                "status", "PUBLISHED"));
    }
}
