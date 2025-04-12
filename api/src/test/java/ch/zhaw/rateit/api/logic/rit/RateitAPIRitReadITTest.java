package ch.zhaw.rateit.api.logic.rit;

import ch.zhaw.rateit.api.config.WebsecurityConfig;
import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.repository.RatingRepository;
import ch.zhaw.rateit.api.logic.rit.repository.RitRepository;
import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.logic.user.repository.UserRepository;
import ch.zhaw.rateit.api.util.AbstractBaseIntegrationTest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@Import(WebsecurityConfig.class)
class RateitAPIRitReadITTest extends AbstractBaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private RitRepository ritRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private final User testUser = new User("test@test.ch", "TestUser", "$2a$12$fTeYfYBa6t0CwZsPpv79IOcEePccWixAEDa9kg3aJcoDNu1dIVokq");

    private final Rit testRit = new Rit("TestRit", "Details", null, testUser);

    @BeforeEach
    void setup() {
        userRepository.deleteAll();
        ratingRepository.deleteAll();
        testUser.setEmailVerified(true);
        userRepository.save(testUser);
    }

    @Test
    void readRit_positive_returnsStatusOk() throws Exception {
        var inputRit = ritRepository.save(testRit);

        var resultActions = mockMvc.perform(get("/rit/read/" + inputRit.getId()).with(user(testUser)));
        String result = resultActions
                .andReturn()
                .getResponse()
                .getContentAsString();

        resultActions.andExpect(status().is2xxSuccessful());
        Rit rit = objectMapper.readValue(result, Rit.class);
        assertNotNull(rit, "Rit must be present in the database");
        assertEquals(inputRit.getId(), rit.getId(), "Rit ID must be equal");
        assertEquals(inputRit.getName(), rit.getName(), "Rit name must be equal");
        assertEquals(inputRit.getDetails(), rit.getDetails(), "Rit details must be equal");
        assertEquals(inputRit.getTags(), rit.getTags(), "Rit tags must be equal");
        assertEquals(inputRit.isPublished(), rit.isPublished(), "Rit isPublished must be equal");
        assertEquals(inputRit.getOwner().getId(), rit.getOwner().getId(), "Rit owner must be equal");

    }

    @Test
    void readRit_negative_RitNotPresent() throws Exception {
        mockMvc.perform(get("/rit/read/123").with(user(testUser)))
                .andExpect(status().isNotFound());
    }

    @Test
    void readRit_negative_unauthorized_returnsForbidden() throws Exception {
        var rit = ritRepository.save(testRit);
        mockMvc.perform(get("/rit/read/" + rit.getId()))
                .andExpect(status().isForbidden());
    }

    @Test
    void createRit_negative_RitNotCorrectOwner() throws Exception {
        User otherOwner = new User("other", "other", "other");
        otherOwner.setEmailVerified(true);
        userRepository.save(otherOwner);
        testRit.setOwner(otherOwner);
        Rit rit = ritRepository.save(testRit);

        mockMvc.perform(get("/rit/read/" + rit.getId()).with(user(testUser)))
                .andExpect(status().isForbidden());
    }
}
