package ch.zhaw.rateit.api.logic.user.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Dataclass for users in database.
 *
 * @author Nicolas Zillig
 */
@Document
public class User {
    @Id
    private String id;
    private String email;
    private String displayName;
    private String hashedPassword;

    public User(String email, String displayName, String hashedPassword) {
        this.email = email;
        this.displayName = displayName;
        this.hashedPassword = hashedPassword;
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

    public String getHashedPassword() {
        return hashedPassword;
    }

    public void setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }
}
