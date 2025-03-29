package ch.zhaw.rateit.api.logic.rit.entity;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Dataclass for rits in the MongoDB database.
 * Represents an item that can be rated, with optional image and details.
 * Owned by a user and can be published or private.
 *
 * @author Micha Mettler
 */
@Document(collection = "rits")
public class Rit {
    @Id
    private String id;

    private String name;
    private String userId;
    private String image;
    private String details;
    private boolean published;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Rit() {
    }

    public Rit(String name, String userId, String image, String details, boolean published) {
        this.name = name;
        this.userId = userId;
        this.image = image;
        this.details = details;
        this.published = published;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
