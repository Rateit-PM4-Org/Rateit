package ch.zhaw.rateit.api.logic.rit;

import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.entity.RitCreateRequest;
import ch.zhaw.rateit.api.logic.rit.repository.RatingRepository;
import ch.zhaw.rateit.api.logic.rit.repository.RitRepository;
import ch.zhaw.rateit.api.logic.rit.service.RitService;
import ch.zhaw.rateit.api.logic.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RateitAPIRitCreateTest {

    @Mock
    private RitRepository ritRepository;

    @Mock
    private RatingRepository ratingRepository;

    private RitService ritService;

    private final User testUser = new User("test@test.ch", "TestUser", "$2a$12$fTeYfYBa6t0CwZsPpv79IOcEePccWixAEDa9kg3aJcoDNu1dIVokq");

    private final List<String> tags = List.of("tag1", "tag2");

    private final List<String> codes = List.of("code1", "code2", "code3");

    @BeforeEach
    void setUp() {
        ritService = new RitService(ritRepository, ratingRepository);
    }

    @Test
    void create_validRequestWithoutImages_returnsSavedRit() {
        RitCreateRequest request = new RitCreateRequest(
                "Test Rit",
                "Details",
                tags,
                codes
        );

        Rit dummyRit = new Rit("Test Rit", "Details", List.of("tag1", "tag2"), codes, testUser);
        when(ritRepository.getRitById(any())).thenReturn(dummyRit);

        Rit result = ritService.create(testUser, request);

        assertNotNull(result);
        assertEquals(request.name(), result.getName());
        assertEquals(request.details(), result.getDetails());
        assertEquals(request.tags(), result.getTags());
        assertEquals(request.codes(), result.getCodes());
        assertFalse(result.isPublished());
        assertEquals(testUser.getId(), result.getOwner().getId());
        verify(ritRepository).save(any());
    }
}
