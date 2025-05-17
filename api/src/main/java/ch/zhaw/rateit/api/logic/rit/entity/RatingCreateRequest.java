package ch.zhaw.rateit.api.logic.rit.entity;


import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;


/* * Request object for rating a rit.
 *
 * @param value The rating value (1-5).
 * @param positiveComment Optional comment for positiveComment feedback.
 * @param negativeComment Optional comment for negativeComment feedback.
 * @author Michèle Berger
 */
public record RatingCreateRequest(
        @Digits(integer = 1, fraction = 0) @NotNull @Min(1) @Max(5) int value,
        String positiveComment,
        String negativeComment
) {
}
