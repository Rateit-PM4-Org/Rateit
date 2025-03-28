package ch.zhaw.rateit.api.logic.user.entity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;

/**
 * Dataclass to store user requests. This is used when a new user is registered.
 * The datafields of this class are used by other controller and service classes to calculate values for user objects.
 *
 * @author Nicolas Zillig
 */
public record UserRegistrationRequest(@NotEmpty @Email String email,
                                      @NotEmpty String displayName,
                                      @NotEmpty @Length(min = 12) @Pattern(
                                              regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*_\\-+=?.:,])[A-Za-z\\d!@#$%^&*_\\-+=?.:,]+$",
                                              message = "Password must contain at least one lowercase, one uppercase, one number, and one special character"
                                      ) String password) {
}
