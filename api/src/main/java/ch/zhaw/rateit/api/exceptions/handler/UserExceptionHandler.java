package ch.zhaw.rateit.api.exceptions.handler;

import ch.zhaw.rateit.api.exceptions.types.UserRegistrationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * Controller to handle all user exceptions
 *
 * @author Nicolas Zillig
 */
@RestControllerAdvice
public class UserExceptionHandler {

    @ExceptionHandler(UserRegistrationException.class)
    public ResponseEntity<Map<String, String>> handleUserRegistration(UserRegistrationException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }
}
