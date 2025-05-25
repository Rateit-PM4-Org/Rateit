package ch.zhaw.rateit.api.logic.rit;

import ch.zhaw.rateit.api.config.WebsecurityConfig;
import ch.zhaw.rateit.api.logic.rit.entity.Rating;
import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.repository.RatingRepository;
import ch.zhaw.rateit.api.logic.rit.repository.RitRepository;
import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.logic.user.repository.UserRepository;
import ch.zhaw.rateit.api.util.AbstractBaseIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@Import(WebsecurityConfig.class)
class RateitAPIRitDeleteITTest extends AbstractBaseIntegrationTest {

    private final User testUser = new User("test@test.ch", "TestUser", "$2a$12$fTeYfYBa6t0CwZsPpv79IOcEePccWixAEDa9kg3aJcoDNu1dIVokq");
    private final Rit testRit = new Rit("TestRit", "Details", null, null, testUser);
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private RatingRepository ratingRepository;
    @Autowired
    private RitRepository ritRepository;
    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setup() {
        userRepository.deleteAll();
        ratingRepository.deleteAll();
        testUser.setEmailVerified(true);
        userRepository.save(testUser);
    }

    @Test
    void deleteRit_positive() throws Exception {
        Rit rit = ritRepository.save(testRit);
        ratingRepository.save(new Rating(4, "test", "test", rit, testUser));

        mockMvc.perform(delete("/api/rits/" + rit.getId()).with(user(testUser)))
                .andExpect(status().is2xxSuccessful());

        assertFalse(ritRepository.existsById(rit.getId()), "Rit must be deleted");
        assertFalse(ratingRepository.existsById(rit.getId()), "All ratings must be deleted");
    }

    @Test
    void deleteRit_negative() throws Exception {
        Rit rit = ritRepository.save(testRit);
        ratingRepository.save(new Rating(4, "test", "test", rit, testUser));

        mockMvc.perform(delete("/api/rits/" + "non-existing-id").with(user(testUser)))
                .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/rits/" + rit.getId()).with(user(new User("fakeuser", "fakeuser", "fakepassword"))))
                .andExpect(status().isForbidden());
    }
}
