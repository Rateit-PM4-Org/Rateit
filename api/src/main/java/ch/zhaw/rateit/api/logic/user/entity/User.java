package ch.zhaw.rateit.api.logic.user.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Dataclass for users in the MongoDB database.
 *
 * @author Nicolas Zillig, Achille Hünenberger
 */
@Document
@JsonIgnoreProperties(value = {"target", "source"})
public class User implements UserDetails {
    @Id
    private String id;
    private String email;
    private String displayName;
    private String hashedPassword;
    private boolean isEmailVerified = false;
    private String emailVerificationToken;

    public User(String email, String displayName, String hashedPassword) {
        this.email = email;
        this.displayName = displayName;
        this.hashedPassword = hashedPassword;
    }

    public String getId() {
        return id;
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

    @JsonIgnore
    public String getHashedPassword() {
        return hashedPassword;
    }

    public void setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

    @JsonIgnore
    public boolean isEmailVerified() {
        return isEmailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        isEmailVerified = emailVerified;
    }

    @JsonIgnore
    public String getEmailVerificationToken() {
        return emailVerificationToken;
    }

    public void setEmailVerificationToken(String emailVerificationToken) {
        this.emailVerificationToken = emailVerificationToken;
    }

    /**
     * Springboot Security Roles
     *
     * @return a collection of GrantedAuthority objects associated with the user.
     * In this implementation, an empty collection is returned, indicating no authorities are granted.
     */
    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    /**
     * For Springboot-Security
     *
     * @return the hashed password associated with this user.
     */
    @Override
    @JsonIgnore
    public String getPassword() {
        return getHashedPassword();
    }

    /**
     * For Springboot-Security
     *
     * @return the email address of the user, which serves as the username.
     */
    @Override
    @JsonIgnore
    public String getUsername() {
        return getEmail();
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return isEmailVerified;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }
}
