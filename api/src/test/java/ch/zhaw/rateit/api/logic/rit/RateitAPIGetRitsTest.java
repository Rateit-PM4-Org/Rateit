package ch.zhaw.rateit.api.logic.rit;

import ch.zhaw.rateit.api.config.WebsecurityConfig;
import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.repository.RatingRepository;
import ch.zhaw.rateit.api.logic.rit.repository.RitRepository;
import ch.zhaw.rateit.api.logic.rit.service.RitService;
import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.util.AbstractBaseIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@AutoConfigureMockMvc
@Import(WebsecurityConfig.class)
 class RateitAPIGetRitsTest extends AbstractBaseIntegrationTest {

    @Mock
    private RitRepository ritRepository;

    @Mock
    private RatingRepository ratingRepository;

    private RitService ritService;

    private final User testUser = new User("test@test.ch", "TestUser", "someHashedPassword");

    @BeforeEach
    void setUp() {
        ritService = new RitService(ritRepository, ratingRepository);
    }

    @Test
    void findAllByOwner_existingUser_returnsOwnedRits() {
        Rit rit1 = new Rit("Rit 1", "Details 1", List.of("tag1"), testUser);
        Rit rit2 = new Rit("Rit 2", "Details 2", List.of("tag2"), testUser);
        List<Rit> expectedRits = new ArrayList<>();
        expectedRits.add(rit1);
        expectedRits.add(rit2);

        // Explicit cast to help type inference
        when(ritRepository.findAllByOwner(testUser)).thenReturn(expectedRits);

        List<Rit> result = ritService.getAll(testUser);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(rit -> rit.getOwner().equals(testUser)));
    }


}
