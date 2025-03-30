package ch.zhaw.rateit.api.logic.attachment.entity;

import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.Instant;

/**
 * Represents an attachment in the MongoDB database.
 * Actual data is stored at the URL.
 * The owner is a reference to the user who uploaded the attachment.
 *
 * @author Achille Hünenberger
 */
@Document
public class Attachment {
    public enum AttachmentType {
        IMAGE
    }

    @Id
    private String id;

    @DocumentReference(lazy = true)
    private User owner;

    private String url;

    private AttachmentType type;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Attachment() {
    }

    public Attachment(String url, AttachmentType type, User owner) {
        this.url = url;
        this.owner = owner;
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public User getOwner() {
        return owner;
    }

    public AttachmentType getType() {
        return type;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
