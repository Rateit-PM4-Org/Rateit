package ch.zhaw.rateit.api.exceptions.handler;

import ch.zhaw.rateit.api.exceptions.types.ValidationExceptionWithField;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller to handle all user exceptions
 *
 * @author Nicolas Zillig, Achille Hünenberger
 */
@RestControllerAdvice
public class ExceptionHandlers {

    /**
     * Handles user registration exceptions of type {@code ValidationExceptionWithField}.
     * This method captures validation errors that include field-specific issues
     * and returns a structured error response with a map of field names to their associated error messages.
     *
     * @param ex the {@code ValidationExceptionWithField} containing validation errors and their corresponding fields
     * @return a map containing a descriptive error message under the "error" key
     * and a map of field names to error messages under the "fields" key
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(ValidationExceptionWithField.class)
    public Map<String, Object> handleUserRegistration(ValidationExceptionWithField ex) {
        return formatErrorResponse(ex.getMessage(), ex.getErrors().stream().collect(
                Collectors.toMap(
                        ValidationExceptionWithField.ValidationError::getField,
                        input -> List.of(input.getMessage())
                )));
    }

    /**
     * Handles exceptions of type {@code MethodArgumentNotValidException}.
     * This method processes validation errors encountered in method arguments
     * and returns a structured response containing a descriptive error message
     * and a map of field-specific errors.
     *
     * @param ex the {@code MethodArgumentNotValidException} containing the validation errors
     * @return a map with an "error" key containing a descriptive error message
     * and a "fields" key containing a map of field names to their associated error messages
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, List<String>> errors = ex.getBindingResult().getFieldErrors().stream().collect(
                Collectors.groupingBy(
                        FieldError::getField,
                        Collectors.mapping(FieldError::getDefaultMessage, Collectors.toList())
                ));

        return formatErrorResponse("Validation failed", errors);
    }

    /**
     * Handles validation exceptions of type {@code HandlerMethodValidationException}.
     * This method processes validation errors that occur during method parameter validation
     * and returns a structured error response containing a descriptive error message
     * and a map of parameter names to corresponding error messages.
     *
     * @param ex the {@code HandlerMethodValidationException} containing validation errors for method parameters
     * @return a map with an "error" key containing a descriptive error message
     * and a "fields" key containing a map of parameter names to lists of error messages
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(HandlerMethodValidationException.class)
    public Map<String, Object> handleValidationExceptions(HandlerMethodValidationException ex) {
        Map<String, List<String>> errors = ex.getParameterValidationResults().stream().collect(
                Collectors.toMap(
                        o -> o.getMethodParameter().getParameterName(),
                        o -> o.getResolvableErrors().stream().map(MessageSourceResolvable::getDefaultMessage).toList()
                ));

        return formatErrorResponse("Validation failed", errors);
    }

    /**
     * Handles exceptions of type {@code AccessDeniedException}.
     * This method captures access denial errors, such as unauthorized resource access,
     * and constructs a response with a relevant error message and additional details.
     *
     * @param ex the {@code AccessDeniedException} containing information about the access denial
     * @return a {@code ResponseEntity} containing a structured error message under the "error" key,
     * and additional details in the "fields" key
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(formatErrorResponse(
                        "Access denied",
                        Map.of("permission", List.of(ex.getMessage()))
                ));
    }

    /**
     * Handles exceptions of type {@code ResponseStatusException}.
     * This method captures the exception, extracts the HTTP status code and reason,
     * and returns a structured response containing an error message and additional error details.
     *
     * @param ex the {@code ResponseStatusException} that contains the HTTP status and error details
     * @return a {@code ResponseEntity} containing an error message and additional details in a structured format
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatusException(ResponseStatusException ex) {
        return ResponseEntity
                .status(ex.getStatusCode())
                .body(formatErrorResponse(
                        ex.getReason() != null ? ex.getReason() : "Unexpected error",
                        Map.of("status", List.of(ex.getStatusCode().toString()))
                ));
    }

    /**
     * Formats an error response into a structured map containing a descriptive error message
     * and additional error details.
     *
     * @param error  a descriptive error message to include in the response
     * @param errors a map containing additional error details, such as field-specific errors
     * @return a map with an "error" key containing the error message,
     * and a "fields" key containing the error details
     */
    private Map<String, Object> formatErrorResponse(String error, Map<?, ?> errors) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", error);
        errorResponse.put("fields", errors);
        return errorResponse;
    }

}
