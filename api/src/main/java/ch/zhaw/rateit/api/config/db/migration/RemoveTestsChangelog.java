package ch.zhaw.rateit.api.config.db.migration;

import ch.zhaw.rateit.api.logic.user.repository.UserRepository;
import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import org.springframework.data.mongodb.core.MongoTemplate;

/**
 * Test-Collection entfernen.
 *
 * @author Achille Hünenberger
 */
@ChangeUnit(id = "removeTestCollection", order = "002", author = "Achille Hünenberger")
public class RemoveTestsChangelog {
    @Execution
    public void removeTestsCollection(MongoTemplate template) {
        template.dropCollection("testEntity");
    }

    @RollbackExecution
    public void rollbackVerificationFields() {
        // not reversable
    }
}
