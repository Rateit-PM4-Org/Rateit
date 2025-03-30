package ch.zhaw.rateit.api.logic.rit;

import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.entity.RitCreateRequest;
import ch.zhaw.rateit.api.logic.rit.repository.RitRepository;
import ch.zhaw.rateit.api.logic.rit.service.RitService;
import ch.zhaw.rateit.api.logic.user.entity.User;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RateitAPIRitCreateTest {

    @Mock
    private RitRepository ritRepository;

    private RitService ritService;

    private final User testUser = new User("test@test.ch", "TestUser", "$2a$12$fTeYfYBa6t0CwZsPpv79IOcEePccWixAEDa9kg3aJcoDNu1dIVokq");

    @BeforeEach
    void setUp() {
        ritService = new RitService(ritRepository);
    }

    @Test
    void create_validRequestWithoutImages_returnsSavedRit() {
        RitCreateRequest request = new RitCreateRequest(
                "Test Rit",
                "Details",
                null,
                false
        );

        Rit dummyRit = new Rit("Test Rit", "Details", null, false, testUser);
        when(ritRepository.save(any())).thenReturn(dummyRit);

        Rit result = ritService.create(testUser, request);

        assertNotNull(result);
        assertEquals(request.name(), result.getName());
        assertEquals(request.details(), result.getDetails());
        assertEquals(testUser.getId(), result.getUser().getId());
        verify(ritRepository).save(any());
    }

    @Test
    void create_imageTooLarge_returnsNullAndErrorSet() {
        byte[] large = "A".repeat(9 * 1024 * 1024).getBytes(); // 9MB
        MockMultipartFile file = new MockMultipartFile("images", "large.jpg", "image/jpeg", large);

        RitCreateRequest request = new RitCreateRequest("Big", "Too big", List.of(file), false);

        assertThrows(ValidationException.class, () -> ritService.create(testUser, request));
        verifyNoInteractions(ritRepository);
    }

    @Test
    void create_tooManyImages_returnsNullAndErrorSet() {
        MockMultipartFile file = new MockMultipartFile("images", "img.jpg", "image/jpeg", "x".getBytes());

        RitCreateRequest request = new RitCreateRequest("Too many", "Details", List.of(file, file, file, file), false);

        assertThrows(ValidationException.class, () -> ritService.create(testUser, request));
        verifyNoInteractions(ritRepository);
    }
}
