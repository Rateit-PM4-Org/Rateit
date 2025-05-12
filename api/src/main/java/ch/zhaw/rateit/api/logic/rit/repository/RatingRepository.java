package ch.zhaw.rateit.api.logic.rit.repository;

import ch.zhaw.rateit.api.logic.rit.entity.Rating;
import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Repository for ratings.
 *
 * @author Michèle Berger
 */
public interface RatingRepository extends MongoRepository<Rating, String> {
    Rating getRatingById(String id);

    void deleteAllByRit(Rit rit);
}
