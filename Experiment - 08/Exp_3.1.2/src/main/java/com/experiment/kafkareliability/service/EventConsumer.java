package com.experiment.kafkareliability.service;

import com.experiment.kafkareliability.model.EventMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.DltHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.retry.annotation.Backoff;
import org.springframework.stereotype.Component;

@Component
public class EventConsumer {
    private static final Logger log = LoggerFactory.getLogger(EventConsumer.class);

    private final EventTrackingService trackingService;

    public EventConsumer(EventTrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @RetryableTopic(
        attempts = "4",
        backoff = @Backoff(delay = 1000, multiplier = 2.0, maxDelay = 8000),
        dltTopicSuffix = ".dlq",
        autoCreateTopics = "true"
    )
    @KafkaListener(topics = "${app.kafka.topic}", groupId = "exp312-reliability-consumers")
    public void consume(EventMessage event) {
        if (event == null || event.getEventId() == null || event.getEventId().isBlank()) {
            throw new IllegalArgumentException("Event ID is required");
        }

        if (trackingService.hasProcessed(event.getEventId())) {
            trackingService.markDuplicate(event.getEventId());
            return;
        }

        int attempt = trackingService.recordAttempt(event.getEventId());
        log.info("Event {} processing attempt {}", event.getEventId(), attempt);

        if (event.isAlwaysFail()) {
            trackingService.markRetry(event.getEventId(), "Simulated permanent failure on attempt " + attempt);
            throw new IllegalStateException("Simulated permanent failure for " + event.getEventId());
        }

        if (attempt <= event.getFailAttempts()) {
            trackingService.markRetry(event.getEventId(), "Simulated transient failure on attempt " + attempt);
            throw new IllegalStateException("Simulated transient failure for " + event.getEventId());
        }

        trackingService.markProcessedOnce(event.getEventId());
        log.info("Event {} processed successfully", event.getEventId());
    }

    @DltHandler
    public void handleDeadLetter(EventMessage event) {
        log.error("Event {} reached DLQ after retries", event.getEventId());
        trackingService.markDeadLetter(event);
    }
}
