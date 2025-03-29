package ch.zhaw.rateit.api.logic.rit.repository;

import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

/**
 * Repository for users.
 *
 * @author Micha Mettler
 */
public interface RitRepository extends MongoRepository<Rit, String> {
}
