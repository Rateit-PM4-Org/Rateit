package ch.zhaw.rateit.api.logic.rit.repository;

import ch.zhaw.rateit.api.logic.rit.entity.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Repository for users.
 *
 * @author Micha Mettler
 */
public interface RatingRepository extends MongoRepository<Rating, String> {
    Rating getRatingById(String id);
}
