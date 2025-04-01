package ch.zhaw.rateit.api.logic.rit;

import ch.zhaw.rateit.api.config.WebsecurityConfig;
import ch.zhaw.rateit.api.logic.rit.entity.Rating;
import ch.zhaw.rateit.api.logic.rit.entity.RatingRequest;
import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.repository.RatingRepository;
import ch.zhaw.rateit.api.logic.rit.repository.RitRepository;
import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.logic.user.repository.UserRepository;
import ch.zhaw.rateit.api.util.AbstractBaseIntegrationTest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@Import(WebsecurityConfig.class)
class RateitAPIRitRateITTest extends AbstractBaseIntegrationTest {

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

    private final Rit testRit = new Rit("TestRit", "Details", null, false, testUser);

    @BeforeEach
    void setup() {
        userRepository.deleteAll();
        ratingRepository.deleteAll();
        testUser.setEmailVerified(true);
        userRepository.save(testUser);
    }

    private static Stream<Arguments> provideValidRatingParams() {
        return Stream.of(
                Arguments.of(5, "something good", "something bad"),
                Arguments.of(3, null, null),
                Arguments.of(1, null, "something bad"),
                Arguments.of(4, "something good", null)
        );
    }

    @ParameterizedTest
    @MethodSource("provideValidRatingParams")
    void createRit_positive_returnsStatusOk(int value, String positive, String negative) throws Exception {
        var rit = ritRepository.save(testRit);
        String input = objectMapper.writeValueAsString(new RatingRequest(rit.getId(), value, positive, negative));

        mockMvc.perform(post("/rit/rate").content(input).contentType(MediaType.APPLICATION_JSON)
                        .with(user(testUser)))
                .andExpect(status().is2xxSuccessful());
    }

    private static Stream<Arguments> provideInvalidRatingParams() {
        return Stream.of(
                Arguments.of(7, null, null), // value is too high
                Arguments.of(0, null, "something bad") // value is too low
        );
    }

    @ParameterizedTest
    @MethodSource("provideInvalidRatingParams")
    void createRit_negative_returnsBadRequest(int value, String positive, String negative) throws Exception {
        var rit = ritRepository.save(testRit);
        String input = objectMapper.writeValueAsString(new RatingRequest(rit.getId(), value, positive, negative));

        mockMvc.perform(post("/rit/rate").content(input).contentType(MediaType.APPLICATION_JSON)
                        .with(user(testUser)))
                .andExpect(status().isBadRequest());
    }


    @Test
    void createRit_negative_unauthorized_returnsForbidden() throws Exception {
        var rit = ritRepository.save(testRit);
        String input = objectMapper.writeValueAsString(new RatingRequest(rit.getId(), 4, "test", "test"));

        mockMvc.perform(post("/rit/rate").content(input).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void createRit_positive_setsTimestamps() throws Exception {
        var rit = ritRepository.save(testRit);
        String input = objectMapper.writeValueAsString(new RatingRequest(rit.getId(), 4, "test", "test"));
        String response = mockMvc.perform(post("/rit/rate").content(input).contentType(MediaType.APPLICATION_JSON)
                        .with(user(testUser)))
                .andExpect(status().is2xxSuccessful()).andReturn().getResponse().getContentAsString();

        String id = objectMapper.readTree(response).get("id").asText();
        Rating rating = ratingRepository.findById(id).orElseThrow();

        assertNotNull(rit, "Rit must be present in the database");
        assertNotNull(rit.getCreatedAt(), "createdAt must be set");
        assertNotNull(rit.getUpdatedAt(), "updatedAt must be set");
        assertEquals(rit.getCreatedAt(), rit.getUpdatedAt(), "createdAt and updatedAt must be equal after creation");
    }

}
