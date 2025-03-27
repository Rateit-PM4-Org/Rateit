package ch.zhaw.rateit.api.logic.user.entity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

/**
 * Login-Data
 *
 * @author Achille Hünenberger
 */
public record UserLoginRequest(@NotEmpty @Email String email, @NotEmpty String password) {
}
