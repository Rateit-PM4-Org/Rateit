package ch.zhaw.rateit.api.exceptions.handler;

import ch.zhaw.rateit.api.exceptions.types.DuplicateEmailUserException;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.validation.method.ParameterValidationResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller to handle all user exceptions
 *
 * @author Nicolas Zillig
 */
@RestControllerAdvice
public class ExceptionHandlers {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(DuplicateEmailUserException.class)
    public Map<String, String> handleUserRegistration(DuplicateEmailUserException ex) {
        return Map.of("error", ex.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, Object> handleValidationExceptions(MethodArgumentNotValidException ex) {

        Map<String, Object> errorResponse = new HashMap<>();

        Map<String, String> errors = ex.getBindingResult().getFieldErrors()
                .stream().collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
        errorResponse.put("error", "Validation failed");
        errorResponse.put("fields", errors);

        return errorResponse;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(HandlerMethodValidationException.class)
    public Map<String, Object> handleValidationExceptions(HandlerMethodValidationException ex) {
        Map<String, Object> errorResponse = new HashMap<>();

        Map<String, List<String>> errors = ex.getParameterValidationResults().stream()
                .collect(Collectors.toMap(o -> o.getMethodParameter().getParameterName(), o -> o.getResolvableErrors().stream().map(MessageSourceResolvable::getDefaultMessage).collect(Collectors.toList())));
        errorResponse.put("error", "Validation failed");
        errorResponse.put("fields", errors);

        return errorResponse;
    }

}
