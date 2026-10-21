FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml .
RUN mvn -B -q dependency:go-offline

COPY src ./src
RUN mvn -B -q clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app

RUN useradd --system --uid 10001 appuser
COPY --from=builder /app/target/cd-canary-demo.jar app.jar

USER 10001
EXPOSE 8080

ENV APP_VERSION=1.0.0
ENV APP_RELEASE=stable

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "/app/app.jar"]
