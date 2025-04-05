package ch.zhaw.rateit.api.logic.rit.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

import java.util.List;

/**
 * Request object for creating a new rit.
 *
 * @param name    The name of the rit.
 * @param details The details of the rit.
 * @param tags    The tags of the rit.
 */
public record RitCreateRequest(
        @NotBlank @Length(min = 12) String name,
        String details,
        @NotNull List<String> tags
) {
}
