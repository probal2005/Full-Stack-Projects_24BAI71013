package com.experiment.ci.contract;

import au.com.dius.pact.consumer.MockServer;
import au.com.dius.pact.consumer.dsl.PactDslJsonBody;
import au.com.dius.pact.consumer.dsl.PactDslWithProvider;
import au.com.dius.pact.consumer.junit5.PactConsumerTestExt;
import au.com.dius.pact.consumer.junit5.PactTestFor;
import au.com.dius.pact.core.model.V4Pact;
import au.com.dius.pact.core.model.annotations.Pact;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(PactConsumerTestExt.class)
class ItemApiContractTest {

    @Pact(
            consumer = "WebFrontend",
            provider = "CiTestingLabApi"
    )
    public V4Pact itemDetailsContract(PactDslWithProvider builder) {
        return builder
                .given("an item with ID 1 exists")
                .uponReceiving("a request for item 1")
                    .path("/api/items/1")
                    .method("GET")
                .willRespondWith()
                    .status(200)
                    .headers(Map.of("Content-Type", "application/json"))
                    .body(new PactDslJsonBody()
                            .integerType("id", 1)
                            .stringType("name", "Keyboard"))
                .toPact(V4Pact.class);
    }

    @Test
    @PactTestFor(pactMethod = "itemDetailsContract")
    void verifiesFrontendExpectation(MockServer server) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(server.getUrl() + "/api/items/1"))
                .GET()
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
        assertTrue(response.body().contains("\"id\":1"));
        assertTrue(response.body().contains("\"name\":\"Keyboard\""));
    }
}
