package ch.zhaw.rateit.api.logic.rating.entity;


import jakarta.validation.constraints.*;


/* * Request object for rating a rit.
 *
 * @param ritId    The ID of the rit to rate.
 * @param value    The rating value (1-5).
 * @param positive Optional comment for positive feedback.
 * @param negative Optional comment for negative feedback.
 * @author Michèle Berger
 */
public record RatingRequest(
        @NotEmpty String ritId,
        @Digits(integer = 1, fraction = 0) @NotNull @Min(1) @Max(5) int value,
        String positive,
        String negative
) {
}
