package ch.zhaw.rateit.api.logic.rit.entity;

import jakarta.validation.constraints.NotEmpty;

public record ImageReference(@NotEmpty String id, @NotEmpty String url) {
}
