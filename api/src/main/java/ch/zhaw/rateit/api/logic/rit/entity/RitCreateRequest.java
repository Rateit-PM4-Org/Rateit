package ch.zhaw.rateit.api.logic.rit.entity;

import ch.zhaw.rateit.api.logic.attachment.entity.Attachment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * Request object for creating a new rit.
 * Contains the name, image, details and published status of the rit.
 *
 * @param name      Name of the rit
 * @param images    List of images for the rit
 * @param details   Details about the rit
 * @param published Whether the rit is published or not
 */
public record RitCreateRequest(
        @NotBlank String name,
        String details,
        List<Attachment> images,
        @NotNull Boolean published
) {
}
