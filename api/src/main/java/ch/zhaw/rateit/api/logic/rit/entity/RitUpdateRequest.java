package ch.zhaw.rateit.api.logic.rit.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * Request object for creating a new rit.
 *
 * @param name    The name of the rit.
 * @param details The details of the rit.
 * @param tags    The tags of the rit.
 */
public record RitUpdateRequest(
        @NotBlank String name,
        String details,
        @NotNull List<String> tags,
        @NotNull List<String> codes
) {
}
