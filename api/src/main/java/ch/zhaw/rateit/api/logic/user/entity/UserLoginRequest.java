package ch.zhaw.rateit.api.logic.user.entity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

/**
 * Login-Data
 *
 * @author Achille Hünenberger
 */
public class UserLoginRequest {
    @NotEmpty
    @Email
    private String email;
    @NotEmpty
    private String password;

    public UserLoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
