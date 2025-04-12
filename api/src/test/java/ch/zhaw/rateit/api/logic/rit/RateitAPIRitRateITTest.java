package ch.zhaw.rateit.api.logic.rit;

import ch.zhaw.rateit.api.config.WebsecurityConfig;
import ch.zhaw.rateit.api.logic.rit.entity.Rating;
import ch.zhaw.rateit.api.logic.rit.entity.RatingCreateRequest;
import ch.zhaw.rateit.api.logic.rit.repository.RatingRepository;
import ch.zhaw.rateit.api.logic.rit.entity.Rit;
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
        String input = objectMapper.writeValueAsString(new RatingCreateRequest(rit, value, positive, negative));

        var resultActions = mockMvc.perform(post("/rit/rate").content(input).contentType(MediaType.APPLICATION_JSON)
                .with(user(testUser)));
        String result = resultActions
                .andReturn()
                .getResponse()
                .getContentAsString();

        resultActions.andExpect(status().is2xxSuccessful());
        Rating rating = objectMapper.readValue(result, Rating.class);
        assertNotNull(rating, "Rating must be present in the database");
        assertEquals(value, rating.getValue(), "Rating value must be equal to the input value");
        assertEquals(positive, rating.getPositiveComment(), "Rating positiveComment must be equal to the input positiveComment");
        assertEquals(negative, rating.getNegativeComment(), "Rating negativeComment must be equal to the input negativeComment");
        assertEquals(testRit.getId(), rating.getRit().getId(), "Rating rit must be equal to the input rit");
        assertEquals(testUser.getId(), rating.getOwner().getId(), "Rating owner must be equal to the input owner");
    }

    private static Stream<Arguments> provideInvalidRatingParams() {
        return Stream.of(
                Arguments.of(7, null, null), // value is too high
                Arguments.of(0, null, "something bad"), // value is too low
                Arguments.of(3.5, null, null) //float number
        );
    }

    @ParameterizedTest
    @MethodSource("provideInvalidRatingParams")
    void createRit_negative_returnsBadRequest(int value, String positive, String negative) throws Exception {
        var rit = ritRepository.save(testRit);
        String input = objectMapper.writeValueAsString(new RatingCreateRequest(rit, value, positive, negative));

        mockMvc.perform(post("/rit/rate").content(input).contentType(MediaType.APPLICATION_JSON)
                        .with(user(testUser)))
                .andExpect(status().isBadRequest());
    }


    @Test
    void createRit_negative_unauthorized_returnsForbidden() throws Exception {
        var rit = ritRepository.save(testRit);
        String input = objectMapper.writeValueAsString(new RatingCreateRequest(rit, 4, "test", "test"));

        mockMvc.perform(post("/rit/rate").content(input).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void createRit_positive_setsTimestamps() throws Exception {
        var rating = ritRepository.save(testRit);
        String input = objectMapper.writeValueAsString(new RatingCreateRequest(rating, 4, "test", "test"));
        String response = mockMvc.perform(post("/rit/rate").content(input).contentType(MediaType.APPLICATION_JSON)
                        .with(user(testUser)))
                .andExpect(status().is2xxSuccessful()).andReturn().getResponse().getContentAsString();

        String id = objectMapper.readTree(response).get("id").asText();

        assertNotNull(rating, "Rating must be present in the database");
        assertNotNull(rating.getCreatedAt(), "createdAt must be set");
        assertNotNull(rating.getUpdatedAt(), "updatedAt must be set");
        assertEquals(rating.getCreatedAt(), rating.getUpdatedAt(), "createdAt and updatedAt must be equal after creation");
        //testcase if rit is not null
        assertNotNull(rating.getId(), "Rit must be present in the database");
    }

}
