package ch.zhaw.rateit.api.logic.rit.entity;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;


/* * Request object for rating a rit.
 *
 * @param ritId    The ID of the rit to rate.
 * @param value    The rating value (1-5).
 * @param positive Optional comment for positive feedback.
 * @param negative Optional comment for negative feedback.
 * @author Michèle Berger
 */
public record RitRateRequest(
        @NotEmpty Rit rit,
        @Min(1) @Max(5) int value,
        String positive,
        String negative
) {
}
