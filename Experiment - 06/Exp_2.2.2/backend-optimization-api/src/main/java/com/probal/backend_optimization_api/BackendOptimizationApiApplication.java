package com.probal.backend_optimization_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.cache.annotation.EnableCaching;


@SpringBootApplication
@EnableCaching
public class BackendOptimizationApiApplication {

    public static void main(String[] args) {

        SpringApplication.run(
                BackendOptimizationApiApplication.class,
                args
        );

    }

}