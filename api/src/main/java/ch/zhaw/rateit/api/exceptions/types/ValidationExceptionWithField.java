package ch.zhaw.rateit.api.exceptions.types;

import jakarta.validation.ValidationException;

import java.util.HashSet;
import java.util.Set;

/**
 * Exception class for validation errors with field information.
 * This class extends the ValidationException class and provides a way to
 * store multiple validation errors with their corresponding field names.
 *
 * @author Achille Hünenberger
 */
public class ValidationExceptionWithField extends ValidationException {
    public record ValidationError(String field, String message) {
        public String getField() {
            return field;
        }

        public Object getMessage() {
            return message;
        }
    }

    private final Set<ValidationError> errors;

    public ValidationExceptionWithField(ValidationError... errors) {
        super("Validation failed");
        this.errors = new HashSet<>(Set.of(errors));
    }

    public Set<ValidationError> getErrors() {
        return errors;
    }

    public void addError(ValidationError error) {
        errors.add(error);
    }
}
