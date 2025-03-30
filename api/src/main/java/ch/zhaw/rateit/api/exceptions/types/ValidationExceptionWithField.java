package ch.zhaw.rateit.api.exceptions.types;

import jakarta.validation.ValidationException;

import java.util.HashSet;
import java.util.Set;

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
