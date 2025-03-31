package ch.zhaw.rateit.api.logic.rit.entity;

import ch.zhaw.rateit.api.logic.user.entity.User;
import java.time.Instant;

public class Rating {

    private int value;
    private String comment;
    private User user;
    private Instant createdAt;

    public Rating(int value, String comment, User user, Instant createdAt) {
        this.value = value;
        this.comment = comment;
        this.user = user;
        this.createdAt = createdAt;
    }

    // Getter & Setter (oder record draus machen, falls keine Logik nötig)

    public int getValue() {
        return value;
    }

    public String getComment() {
        return comment;
    }

    public User getUser() {
        return user;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}