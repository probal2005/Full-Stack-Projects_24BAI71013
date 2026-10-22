package com.experiment.kafkareliability.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class EventRequest {
    private String eventId;

    @NotBlank(message = "Event content is required")
    @Size(max = 500, message = "Content must be at most 500 characters")
    private String content;

    @Min(value = 0, message = "Fail attempts cannot be negative")
    @Max(value = 3, message = "Fail attempts must be between 0 and 3")
    private int failAttempts;

    private boolean alwaysFail;

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public int getFailAttempts() { return failAttempts; }
    public void setFailAttempts(int failAttempts) { this.failAttempts = failAttempts; }

    public boolean isAlwaysFail() { return alwaysFail; }
    public void setAlwaysFail(boolean alwaysFail) { this.alwaysFail = alwaysFail; }
}
