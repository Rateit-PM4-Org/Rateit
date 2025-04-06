package ch.zhaw.rateit.api.logic.rating.entity;

import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.Instant;

/**
 * Dataclass for ratings in the MongoDB database.
 * Represents a rating of a rit, with optional positive and negative feedback.
 * Owned by a user and associated with a rit.
 *
 * @author Michèle Berger
 */
@Document
public class Rating {
    @Id
    private String id;

    @DocumentReference(lazy = true)
    private Rit rit;

    @DocumentReference(lazy = true)
    private User owner;

    private int value;
    private String positiveComment;
    private String negative;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Rating() {
    }

    public Rating(int value, String positiveComment, String negative, Rit rit, User owner) {
        this.value = value;
        this.positiveComment = positiveComment;
        this.negative = negative;
        this.rit = rit;
        this.owner = owner;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Rit getRit() {
        return rit;
    }

    public void setRit(Rit rit) {
        this.rit = rit;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public String getPositiveComment() {
        return positiveComment;
    }

    public void setPositiveComment(String positiveComment) {
        this.positiveComment = positiveComment;
    }

    public String getNegative() {
        return negative;
    }

    public void setNegative(String negative) {
        this.negative = negative;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}