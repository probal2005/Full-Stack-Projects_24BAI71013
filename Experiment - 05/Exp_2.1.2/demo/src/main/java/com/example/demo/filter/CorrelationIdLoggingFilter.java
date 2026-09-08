package com.example.demo.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.util.UUID;

@Component
@Slf4j
public class CorrelationIdLoggingFilter extends OncePerRequestFilter {

    private static final String CORRELATION_ID_HEADER = "X-Correlation-Id";
    private static final String MDC_KEY = "correlationId";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String correlationId = request.getHeader(CORRELATION_ID_HEADER);
        if (correlationId == null) correlationId = UUID.randomUUID().toString();

        MDC.put(MDC_KEY, correlationId);

        ContentCachingRequestWrapper reqWrap = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper resWrap = new ContentCachingResponseWrapper(response);

        long start = System.currentTimeMillis();
        log.info("➡️ REQUEST: {} {} | Client: {}", reqWrap.getMethod(), reqWrap.getRequestURI(), reqWrap.getRemoteAddr());

        try {
            chain.doFilter(reqWrap, resWrap);
        } finally {
            long duration = System.currentTimeMillis() - start;
            log.info("⬅️ RESPONSE: {} {} | Status: {} | Duration: {}ms", 
                    reqWrap.getMethod(), reqWrap.getRequestURI(), resWrap.getStatus(), duration);
            resWrap.copyBodyToResponse();
            MDC.clear();
        }
    }
}