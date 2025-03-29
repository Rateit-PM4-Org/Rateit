package ch.zhaw.rateit.api.logic.user.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Dataclass for users in database.
 *
 * @author Nicolas Zillig
 */
@Document
public class User implements UserDetails {
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

    /**
     * Springboot Security Roles
     *
     * @return
     */
    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    /**
     * For Springboot-Security
     *
     * @return
     */
    @Override
    @JsonIgnore
    public String getPassword() {
        return getHashedPassword();
    }

    /**
     * For Springboot-Security
     *
     * @return
     */
    @Override
    @JsonIgnore
    public String getUsername() {
        return getEmail();
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
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
