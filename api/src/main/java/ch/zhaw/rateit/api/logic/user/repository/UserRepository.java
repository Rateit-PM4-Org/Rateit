package ch.zhaw.rateit.api.logic.user.repository;

import ch.zhaw.rateit.api.logic.user.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

/**
 * Repository for users.
 *
 * @author Nicolas Zillig
 */
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailVerificationToken(String token);
}
