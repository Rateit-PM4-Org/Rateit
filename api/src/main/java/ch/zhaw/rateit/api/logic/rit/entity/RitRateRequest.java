package ch.zhaw.rateit.api.logic.rit.entity;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;



/**
 * Request object for rating a rit.
 * Contains the rit id, the rating value and an optional comment.
 *
 * @param ritId   Id of the rit to rate
 * @param value   Rating value between 1 and 5
 * @param comment Optional comment for the rating
 *
 */
public record RitRateRequest(
        @NotBlank String ritId,
        @Min(1) @Max(5) int value,
        String comment
) {
}
