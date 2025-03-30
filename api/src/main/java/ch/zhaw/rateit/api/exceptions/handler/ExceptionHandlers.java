package ch.zhaw.rateit.api.exceptions.handler;

import ch.zhaw.rateit.api.exceptions.types.ValidationExceptionWithField;
import jakarta.validation.ValidationException;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
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
    @ExceptionHandler(ValidationExceptionWithField.class)
    public Map<String, Object> handleUserRegistration(ValidationExceptionWithField ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getMessage());
        errorResponse.put("fields", ex.getErrors().stream().collect(Collectors.toMap(ValidationExceptionWithField.ValidationError::getField, ValidationExceptionWithField.ValidationError::getMessage)));
        return errorResponse;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> errorResponse = new HashMap<>();

        Map<String, List<String>> errors = ex.getBindingResult().getFieldErrors()
                .stream().collect(Collectors.groupingBy(FieldError::getField,
                        Collectors.mapping(FieldError::getDefaultMessage, Collectors.toList())));
        errorResponse.put("error", "Validation failed");
        errorResponse.put("fields", errors);

        return errorResponse;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(HandlerMethodValidationException.class)
    public Map<String, Object> handleValidationExceptions(HandlerMethodValidationException ex) {
        Map<String, Object> errorResponse = new HashMap<>();

        Map<String, List<String>> errors = ex.getParameterValidationResults().stream()
                .collect(Collectors.toMap(o -> o.getMethodParameter().getParameterName(), o -> o.getResolvableErrors().stream().map(MessageSourceResolvable::getDefaultMessage).toList()));
        errorResponse.put("error", "Validation failed");
        errorResponse.put("fields", errors);

        return errorResponse;
    }

}
