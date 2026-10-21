package com.experiment.kafkareliability.messaging;

import com.experiment.kafkareliability.model.PostEvent;
import com.experiment.kafkareliability.service.EventTrackingService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.DltHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.retry.annotation.Backoff;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PostEventConsumer {

    private static final Pattern RETRY_TOPIC =
            Pattern.compile(".*-retry-(\\d+)$");

    private final EventTrackingService trackingService;
    private final String mainTopic;

    public PostEventConsumer(
            EventTrackingService trackingService,
            @Value("${app.kafka.topic}") String mainTopic) {
        this.trackingService = trackingService;
        this.mainTopic = mainTopic;
    }

    @RetryableTopic(
            attempts = "4",
            backoff = @Backoff(
                    delay = 1000,
                    multiplier = 2.0,
                    maxDelay = 10000),
            dltTopicSuffix = ".DLT",
            autoCreateTopics = "true",
            numPartitions = "3"
    )
    @KafkaListener(
            topics = "${app.kafka.topic}",
            groupId = "${spring.kafka.consumer.group-id}")
    public void consume(
            PostEvent event,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String receivedTopic) {

        try {
            boolean processed = trackingService.processEvent(event);

            if (processed) {
                System.out.println(
                        "[KAFKA] Successfully processed event " + event.getEventId());
            } else {
                System.out.println(
                        "[IDEMPOTENCY] Duplicate ignored: " + event.getEventId());
            }
        } catch (RuntimeException exception) {
            int attempt = getAttempt(receivedTopic);

            trackingService.log(event, "RETRYING",
                    "Attempt " + attempt + " failed: " + exception.getMessage(),
                    attempt);

            System.err.println(
                    "[RETRY] Event " + event.getEventId()
                            + ", attempt " + attempt
                            + ": " + exception.getMessage());

            throw exception;
        }
    }

    @DltHandler
    public void handleDeadLetter(PostEvent event) {
        trackingService.log(event, "DLQ",
                "All configured processing attempts exhausted. " +
                        "Event routed to the dead-letter topic.",
                4);

        System.err.println(
                "[DLQ] Event moved to " + mainTopic + ".DLT: "
                        + event.getEventId());
    }

    private int getAttempt(String topic) {
        Matcher matcher = RETRY_TOPIC.matcher(topic);

        if (matcher.matches()) {
            return Integer.parseInt(matcher.group(1)) + 2;
        }

        return 1;
    }
}
