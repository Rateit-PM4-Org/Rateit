package ch.zhaw.rateit.api.config.db.migration;

import ch.zhaw.rateit.api.logic.user.repository.UserRepository;
import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;

/**
 * Neue Felder für Email-Verifikation:
 * - vorhandene User als bestätigt markieren
 *
 * @author Achille Hünenberger
 */
@ChangeUnit(id = "emailVerificationFieldsUser", order = "001", author = "Achille Hünenberger")
public class EmailVerificationFieldsUserChangelog {
    @Execution
    public void addVerificationFields(UserRepository userRepository) {
        // Add verification fields to user
        userRepository.findAll().forEach(user -> {
            user.setEmailVerificationToken(null);
            user.setEmailVerified(true);
            userRepository.save(user);
        });
    }

    @RollbackExecution
    public void rollbackVerificationFields() {
        // not reversable
    }
}
