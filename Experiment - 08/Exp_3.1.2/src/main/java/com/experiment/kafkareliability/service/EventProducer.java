package com.experiment.kafkareliability.service;

import com.experiment.kafkareliability.model.EventMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class EventProducer {
    private final KafkaTemplate<String, EventMessage> kafkaTemplate;
    private final EventTrackingService trackingService;

    @Value("${app.kafka.topic}")
    private String topic;

    public EventProducer(KafkaTemplate<String, EventMessage> kafkaTemplate,
                         EventTrackingService trackingService) {
        this.kafkaTemplate = kafkaTemplate;
        this.trackingService = trackingService;
    }

    public EventMessage publish(EventMessage event) throws Exception {
        trackingService.register(event);
        try {
            kafkaTemplate.send(topic, event.getEventId(), event).get(10, TimeUnit.SECONDS);
        } catch (Exception ex) {
            throw new IllegalStateException("Could not publish event to Kafka: " + ex.getMessage(), ex);
        }
        return event;
    }

    public void republish(EventMessage event) throws Exception {
        try {
            kafkaTemplate.send(topic, event.getEventId(), event).get(10, TimeUnit.SECONDS);
        } catch (Exception ex) {
            throw new IllegalStateException("Could not republish event: " + ex.getMessage(), ex);
        }
    }
}
