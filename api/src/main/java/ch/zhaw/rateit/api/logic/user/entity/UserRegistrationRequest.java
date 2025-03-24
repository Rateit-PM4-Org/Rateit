package ch.zhaw.rateit.api.logic.user.entity;

/**
 * Dataclass for users requests.
 *
 * @author Nicolas Zillig
 */
public class UserRegistrationRequest {
    private String email;
    private String displayName;
    private String cleanPassword;

    public UserRegistrationRequest(String email, String displayName, String cleanPassword) {
        this.email = email;
        this.displayName = displayName;
        this.cleanPassword = cleanPassword;
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

    public String getCleanPassword() {
        return cleanPassword;
    }

    public void setCleanPassword(String cleanPassword) {
        this.cleanPassword = cleanPassword;
    }
}
