package ch.zhaw.rateit.api.logic.rit.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * Request object for updating an existing Rit.
 *
 * @param name    The name of the Rit
 * @param details The details of the Rit
 * @param tags    The tags of the Rit
 * @param codes   The barcodes of the Rit
 * @author Micha Mettler
 */
public record RitUpdateRequest(
        @NotBlank String name,
        String details,
        @NotNull List<String> tags,
        @NotNull List<String> codes
) {
}
