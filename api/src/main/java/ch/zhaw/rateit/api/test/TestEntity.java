package ch.zhaw.rateit.api.test;

import org.springframework.data.annotation.Id;

public class TestEntity {
    @Id
    private String id;
    private String value;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
