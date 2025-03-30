package ch.zhaw.rateit.api.logic.rit.repository;

import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Repository for users.
 *
 * @author Micha Mettler
 */
public interface RitRepository extends MongoRepository<Rit, String> {
}
