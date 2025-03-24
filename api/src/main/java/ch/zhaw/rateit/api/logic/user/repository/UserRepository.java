package ch.zhaw.rateit.api.logic.user.repository;

import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

/**
 * Interface defining methods needed for the user class.
 *
 * @author Nicolas Zillig
 */
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}
