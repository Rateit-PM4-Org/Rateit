package ch.zhaw.rateit.api.logic.rit.entity;

import ch.zhaw.rateit.api.logic.attachment.entity.Attachment;
import ch.zhaw.rateit.api.logic.rating.entity.Rating;
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
 * Owned by a owner and can be published or private.
 *
 * @author Micha Mettler
 */
@Document
public class Rit {
    @Id
    private String id;

    @DocumentReference(lazy = true)
    private User owner;

    @DocumentReference(lazy = true)
    private List<Attachment> images;

    private String name;
    private String details;
    private boolean published;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Rit() {
    }

    public Rit(String name, String details, List<Attachment> images, boolean published, User owner) {
        this.name = name;
        this.details = details;
        this.images = images;
        this.published = published;
        this.owner = owner;
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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public List<Attachment> getImages() {
        return images;
    }

    public void setImages(List<Attachment> images) {
        this.images = images;
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

    public void addRating(Rating rating) {
    }
}
