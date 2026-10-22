package com.experiment.kafkareliability.model;

import java.time.Instant;

public class EventMessage {
    private String eventId;
    private String content;
    private int failAttempts;
    private boolean alwaysFail;
    private String createdAt;

    public EventMessage() {
    }

    public EventMessage(String eventId, String content, int failAttempts,
                        boolean alwaysFail, String createdAt) {
        this.eventId = eventId;
        this.content = content;
        this.failAttempts = failAttempts;
        this.alwaysFail = alwaysFail;
        this.createdAt = createdAt == null ? Instant.now().toString() : createdAt;
    }

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public int getFailAttempts() { return failAttempts; }
    public void setFailAttempts(int failAttempts) { this.failAttempts = failAttempts; }

    public boolean isAlwaysFail() { return alwaysFail; }
    public void setAlwaysFail(boolean alwaysFail) { this.alwaysFail = alwaysFail; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
