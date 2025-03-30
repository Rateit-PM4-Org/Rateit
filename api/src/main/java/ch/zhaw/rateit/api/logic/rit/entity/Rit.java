package ch.zhaw.rateit.api.logic.rit.entity;

import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.Instant;
import java.util.List;

/**
 * Dataclass for rits in the MongoDB database.
 * Represents an item that can be rated, with optional image and details.
 * Owned by a user and can be published or private.
 *
 * @author Micha Mettler
 */
@Document
public class Rit {
    @Id
    private String id;

    @DocumentReference(lazy = true)
    private User user;

    private String name;
    private List<ImageReference> images;
    private String details;
    private boolean published = false;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Rit() {
    }

    public Rit(String name, String details, List<ImageReference> images, Boolean published, User user) {
        this.name = name;
        this.details = details;
        this.images = images;
        if(published==null){
            published = false;
        }
        this.published = published;
        this.user = user;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<ImageReference> getImages() {
        return images;
    }

    public void setImages(List<ImageReference> images) {
        this.images = images;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Boolean isPublished() {
        return published;
    }

    public void setPublished(Boolean published) {
        if(published == null) {
            published = false;
        }
        this.published = published;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
