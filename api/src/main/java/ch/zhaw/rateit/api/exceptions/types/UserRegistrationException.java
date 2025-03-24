package ch.zhaw.rateit.api.exceptions.types;

/**
 * Exception for user registration
 *
 * @author Nicolas Zillig
 */
public class UserRegistrationException extends RuntimeException {
    public UserRegistrationException(String message) {
        super(message);
    }
}
