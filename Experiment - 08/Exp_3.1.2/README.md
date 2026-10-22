# Experiment 3.1.2 — Reliable Event Processing with Apache Kafka

## Aim
Implement retry strategies, a dead-letter queue (DLQ), and idempotent event processing.

## Technologies
Java 17+, Spring Boot 3.4.5, Spring Kafka, Apache Kafka 3.9.1, Docker Compose.

## Run
1. Start the Kafka broker:
   docker compose up -d
2. Wait until Kafka is healthy:
   docker compose ps
3. Build:
   mvn -DskipTests clean package
4. Start the application:
   mvn spring-boot:run
5. Open http://localhost:8082/

## API
- GET /api/health
- GET /api/stats
- GET /api/events?limit=50
- POST /api/events
- POST /api/events/{id}/duplicate

## Test scenarios
Normal event:
{"content":"Order created"}

Transient failures followed by success:
{"content":"Temporary error test","failAttempts":2}

Permanent failure and DLQ:
{"content":"Permanent failure test","alwaysFail":true}

Idempotency:
Publish an event with an explicit eventId, wait until it is processed, then use Replay ID in the dashboard or POST /api/events/{id}/duplicate.

## Reliability configuration
Four total attempts (initial delivery + retry-topic deliveries), exponential delays starting at 1 second with multiplier 2 and maximum delay 8 seconds. The event consumer routes exhausted failures to the .dlq topic.

## Lab limitation
The event history and idempotency ledger are in-memory for demonstration. They reset when the application restarts and are not a production-grade durable deduplication store.
