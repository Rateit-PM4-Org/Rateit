package ch.zhaw.rateit.api.logic.rit;

import ch.zhaw.rateit.api.config.WebsecurityConfig;
import ch.zhaw.rateit.api.logic.rit.entity.Rating;
import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.repository.RatingRepository;
import ch.zhaw.rateit.api.logic.rit.service.RatingService;
import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.util.AbstractBaseIntegrationTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@AutoConfigureMockMvc
@Import(WebsecurityConfig.class)
class RateitAPIGetRatingsTest extends AbstractBaseIntegrationTest {
    @Mock
    private RatingRepository ratingRepository;
    private RatingService ratingService;
    private final User testUser = new User("test@test.ch", "TestUser", "someHashedPassword");
    private Rit testRit = new Rit("test rit", "test details", new ArrayList<>(), testUser);

    @BeforeEach
    void setUp() {
        ratingService = new RatingService(ratingRepository);
    }

    @Test
    void findAllByRit_existingRit() {
        Rating rating1 = new Rating(5, "rating1 positive", "rating1 negative", testRit, testUser);
        Rating rating2 = new Rating(2, "rating2 positive", "rating2 negative", testRit, testUser);
        List<Rating> expectedRatings = new ArrayList<>();
        expectedRatings.add(rating1);
        expectedRatings.add(rating2);

        when(ratingRepository.getRatingsByRit(testRit)).thenReturn(expectedRatings);

        List<Rating> result = ratingService.getAllRatingByRit(testRit);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(rating -> rating.getRit().equals(testRit)));
    }
}
