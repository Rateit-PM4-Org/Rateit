package ch.zhaw.rateit.api.logic.user.entity;

/**
 * Dataclass to store user requests. This is used when a new user is registered.
 * The datafields of this class are used by other controller and service classes to calculate values for user objects.
 *
 * @author Nicolas Zillig
 */
public class UserRegistrationRequest {
    private String email;
    private String displayName;
    private String password;

    public UserRegistrationRequest(String email, String displayName, String password) {
        this.email = email;
        this.displayName = displayName;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
