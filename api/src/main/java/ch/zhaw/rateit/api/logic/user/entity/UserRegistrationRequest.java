package ch.zhaw.rateit.api.logic.user.entity;

/**
 * Dataclass to store user requests. This is used when a new user is registered.
 * The datafields of this class are used by other controller and service classes to calculate values for user objects.
 *
 * @author Nicolas Zillig
 */
public record UserRegistrationRequest(String email, String displayName, String password) {
}
