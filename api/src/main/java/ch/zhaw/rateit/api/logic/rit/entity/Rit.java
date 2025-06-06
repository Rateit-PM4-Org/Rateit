package ch.zhaw.rateit.api.logic.rit.entity;

import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.Instant;
import java.util.List;
import java.util.Set;

/**
 * Represents a Rit entity stored in the MongoDB database.
 * Each Rit is linked to a User entity as its owner and a collection of Rating entities, which
 * represent user evaluations for the Rit.
 *
 * @author Micha Mettler
 */
@Document
public class Rit {
    @Id
    private String id;

    @DocumentReference(lazy = true)
    private User owner;

    @DocumentReference(lazy = true, lookup = "{'rit': ?#{#self._id}}")
    @ReadOnlyProperty
    private Set<Rating> ratings;

    private String name;
    private String details;
    private boolean published;
    private List<String> tags;
    private List<String> codes;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Rit() {
    }

    public Rit(String name, String details, List<String> tags, List<String> codes, User owner) {
        this.name = name;
        this.details = details;
        this.codes = codes;
        this.tags = tags;
        this.published = false;
        this.owner = owner;
    }

    public String getId() {
        return id;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public List<String> getCodes() {
        return codes;
    }

    public void setCodes(List<String> codes) {
        this.codes = codes;
    }

    public boolean isPublished() {
        return published;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setId(String s) {
        this.id = s;
    }

    public Set<Rating> getRatings() {
        return ratings;
    }
}
