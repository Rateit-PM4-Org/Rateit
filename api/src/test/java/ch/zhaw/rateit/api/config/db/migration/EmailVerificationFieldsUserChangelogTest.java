package ch.zhaw.rateit.api.config.db.migration;

import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.logic.user.repository.UserRepository;
import ch.zhaw.rateit.api.util.AbstractBaseIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.jupiter.api.Assertions.assertTrue;

class EmailVerificationFieldsUserChangelogTest extends AbstractBaseIntegrationTest {

    @Autowired
    UserRepository userRepository;

    @BeforeEach
    void init() {
        userRepository.deleteAll();
    }

    @Test
    void testAddVerificationFields() {
        User testUser = new User("test@test.ch", "TestUser", "$2a$12$fTeYfYBa6t0CwZsPpv79IOcEePccWixAEDa9kg3aJcoDNu1dIVokq"); //pw: test
        User testUserNoChange = new User("test@test.com", "TestUser", "$2a$12$fTeYfYBa6t0CwZsPpv79IOcEePccWixAEDa9kg3aJcoDNu1dIVokq");

        testUser.setEmailVerified(false);
        testUserNoChange.setEmailVerified(true);

        userRepository.save(testUser);
        userRepository.save(testUserNoChange);

        new EmailVerificationFieldsUserChangelog().addVerificationFields(userRepository);

        User user = userRepository.findByEmail(testUser.getEmail()).get();
        User userNoChange = userRepository.findByEmail(testUserNoChange.getEmail()).get();

        assertTrue(user.isEmailVerified());
        assertTrue(userNoChange.isEmailVerified());

        userRepository.deleteAll();
    }
}
