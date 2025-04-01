package ch.zhaw.rateit.api.logic.rating.entity;

import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.Instant;

@Document
public class Rating {
    @Id
    private String id;

    @DocumentReference(lazy = true)
    private Rit rit;

    @DocumentReference(lazy = true)
    private User owner;

    private int value;
    private String positive;
    private String negative;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Rating() {
    }

    public Rating(int value, String positive, String negative, Rit rit, User owner) {
        this.value = value;
        this.positive = positive;
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

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public Rit getRit() {
        return rit;
    }
}