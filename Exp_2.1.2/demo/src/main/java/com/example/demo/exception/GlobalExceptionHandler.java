package com.example.demo.exception;

import com.example.demo.dto.ErrorResponse;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private ErrorResponse buildErrorResponse(HttpStatus status, String error, String message, WebRequest request) {
        String path = request.getDescription(false).replace("uri=", "");
        String correlationId = MDC.get("correlationId");
        if (correlationId == null) correlationId = "N/A";
        return new ErrorResponse(
                LocalDateTime.now(),
                status.value(),
                error,
                message,
                path,
                correlationId
        );
    }

    @ExceptionHandler(StudentNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(StudentNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(buildErrorResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(DuplicateEmailException ex, WebRequest request) {
        return new ResponseEntity<>(buildErrorResponse(HttpStatus.CONFLICT, "Conflict", ex.getMessage(), request), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            errors.put(((FieldError) error).getField(), error.getDefaultMessage());
        });
        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request", "Validation failed: " + errors, request),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex, WebRequest request) {
        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", ex.getMessage(), request),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}