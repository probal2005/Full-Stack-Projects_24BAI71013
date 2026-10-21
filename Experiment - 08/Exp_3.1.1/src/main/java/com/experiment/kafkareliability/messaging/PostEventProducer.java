package com.experiment.kafkareliability.messaging;

import com.experiment.kafkareliability.model.PostEvent;
import com.experiment.kafkareliability.service.EventTrackingService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class PostEventProducer {

    private final KafkaTemplate<String, PostEvent> kafkaTemplate;
    private final EventTrackingService trackingService;
    private final String topic;

    public PostEventProducer(
            KafkaTemplate<String, PostEvent> kafkaTemplate,
            EventTrackingService trackingService,
            @Value("${app.kafka.topic}") String topic) {
        this.kafkaTemplate = kafkaTemplate;
        this.trackingService = trackingService;
        this.topic = topic;
    }

    public PostEvent publish(String content, String scheduledAt,
                             boolean simulateFailure) {
        PostEvent event = new PostEvent(
                UUID.randomUUID().toString(),
                content,
                scheduledAt,
                simulateFailure,
                Instant.now());

        CompletableFuture<?> result = kafkaTemplate
                .send(topic, event.getEventId(), event);

        result.whenComplete((sendResult, error) -> {
            if (error != null) {
                trackingService.log(event, "FAILED",
                        "Kafka publication failed: " + error.getMessage(), 0);
            } else {
                trackingService.log(event, "PUBLISHED",
                        "Event published to Kafka topic " + topic, 0);
            }
        });

        return event;
    }

    public void republish(PostEvent event) {
        kafkaTemplate.send(topic, event.getEventId(), event)
                .whenComplete((result, error) -> {
                    if (error != null) {
                        trackingService.log(event, "FAILED",
                                "Republishing failed: " + error.getMessage(), 0);
                    } else {
                        trackingService.log(event, "PUBLISHED",
                                "Event republished to Kafka.", 0);
                    }
                });
    }
}
