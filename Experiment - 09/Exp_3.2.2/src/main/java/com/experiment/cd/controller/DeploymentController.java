package com.experiment.cd.controller;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DeploymentController {

    @Value("${app.version:1.0.0}")
    private String version;

    @Value("${app.release:stable}")
    private String release;

    @GetMapping("/api/health")
    public Map<String, Object> health() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", "UP");
        result.put("service", "CD Canary Deployment Demo");
        result.put("timestamp", Instant.now().toString());
        return result;
    }

    @GetMapping("/api/version")
    public Map<String, Object> version() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("application", "CD Canary Deployment Demo");
        result.put("version", version);
        result.put("release", release);
        result.put("timestamp", Instant.now().toString());
        return result;
    }

    @GetMapping("/api/deployment")
    public Map<String, Object> deployment() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("release", release);
        result.put("version", version);
        result.put("message", "Request served successfully");
        return result;
    }
}
