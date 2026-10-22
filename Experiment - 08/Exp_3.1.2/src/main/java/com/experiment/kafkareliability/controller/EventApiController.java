package com.experiment.kafkareliability.controller;

import com.experiment.kafkareliability.dto.EventRequest;
import com.experiment.kafkareliability.model.EventMessage;
import com.experiment.kafkareliability.service.EventProducer;
import com.experiment.kafkareliability.service.EventTrackingService;
import jakarta.validation.Valid;
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
    private final EventProducer producer;
    private final EventTrackingService trackingService;

    public EventApiController(EventProducer producer, EventTrackingService trackingService) {
        this.producer = producer;
        this.trackingService = trackingService;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", "UP");
        result.put("service", "Experiment 3.1.2 - Kafka Reliability Lab");
        result.put("timestamp", Instant.now().toString());
        result.put("port", 8082);
        return result;
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        return trackingService.statistics();
    }

    @GetMapping("/events")
    public Map<String, Object> events(@RequestParam(defaultValue = "50") int limit) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("events", trackingService.recentEvents(limit));
        result.put("stats", trackingService.statistics());
        return result;
    }

    @PostMapping("/events")
    public ResponseEntity<?> publish(@Valid @RequestBody EventRequest request) {
        String id = request.getEventId() == null || request.getEventId().isBlank()
                ? UUID.randomUUID().toString()
                : request.getEventId().trim();

        EventMessage event = new EventMessage(
                id,
                request.getContent().trim(),
                request.getFailAttempts(),
                request.isAlwaysFail(),
                Instant.now().toString()
        );

        try {
            producer.publish(event);
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("message", "Event published to Kafka");
            result.put("event", event);
            return ResponseEntity.accepted().body(result);
        } catch (Exception ex) {
            Map<String, String> error = new LinkedHashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
        }
    }

    @PostMapping("/events/{id}/duplicate")
    public ResponseEntity<?> duplicate(@PathVariable String id) {
        EventMessage event = trackingService.findMessage(id);
        if (event == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            producer.republish(event);
            return ResponseEntity.accepted().body(Map.of(
                    "message", "Duplicate delivery test published using the same event ID",
                    "eventId", id
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", ex.getMessage()));
        }
    }
}
