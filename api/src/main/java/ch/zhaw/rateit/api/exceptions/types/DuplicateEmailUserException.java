package ch.zhaw.rateit.api.exceptions.types;

/**
 * Exception for user registration
 *
 * @author Nicolas Zillig
 */
public class DuplicateEmailUserException extends RuntimeException {
    public DuplicateEmailUserException(String message) {
        super(message);
    }
}
