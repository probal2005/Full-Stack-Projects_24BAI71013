package com.experiment.kafkareliability.model;

import java.time.Instant;

public class PostEvent {

    private String eventId;
    private String content;
    private String scheduledAt;
    private boolean simulateFailure;
    private Instant createdAt;

    public PostEvent() {
    }

    public PostEvent(
            String eventId,
            String content,
            String scheduledAt,
            boolean simulateFailure,
            Instant createdAt) {
        this.eventId = eventId;
        this.content = content;
        this.scheduledAt = scheduledAt;
        this.simulateFailure = simulateFailure;
        this.createdAt = createdAt;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(String scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public boolean isSimulateFailure() {
        return simulateFailure;
    }

    public void setSimulateFailure(boolean simulateFailure) {
        this.simulateFailure = simulateFailure;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
