package ch.zhaw.rateit.api.logic.rit.entity;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

/**
 * Dataclass to store rit requests. This is used when a new rit is created.
 * @param name name of the rit
 * @param image image base64-encoded image of the rit
 * @param details details of the rit
 * @param published published status of the rit
 */
public record RitCreateRequest(
        @NotEmpty String name,
        @Size(max = 500_000, message = "Image too large. Max 500 KB base64.") String image,
        String details,
        boolean published
) {}
