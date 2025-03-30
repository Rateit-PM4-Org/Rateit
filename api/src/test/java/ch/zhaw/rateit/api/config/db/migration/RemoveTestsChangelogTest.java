package ch.zhaw.rateit.api.config.db.migration;


import ch.zhaw.rateit.api.util.AbstractBaseIntegrationTest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;


class RemoveTestsChangelogTest extends AbstractBaseIntegrationTest {

    @Autowired
    MongoTemplate mongoTemplate;

    @BeforeEach
    void setUp() {
        mongoTemplate.createCollection("testEntity");
    }

    @AfterEach
    void tearDown() {
        mongoTemplate.dropCollection("testEntity");
    }

    @Test
    void testRemoveTestsCollection() {
        // Check if the collection exists before running the migration
        boolean collectionExistsBefore = mongoTemplate.collectionExists("testEntity");
        assertTrue(collectionExistsBefore, "Collection should exist before migration");

        // Run the migration
        new RemoveTestsChangelog().removeTestsCollection(mongoTemplate);

        // Check if the collection has been removed
        boolean collectionExistsAfter = mongoTemplate.collectionExists("testEntity");
        assertFalse(collectionExistsAfter, "Collection should not exist after migration");
    }

}
