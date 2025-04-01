package ch.zhaw.rateit.api.logic.rating.repository;

import ch.zhaw.rateit.api.logic.rating.entity.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Repository for ratings.
 *
 * @author Michèle Berger
 */
public interface RatingRepository extends MongoRepository<Rating, String> {
    Rating getRatingById(String id);
}
