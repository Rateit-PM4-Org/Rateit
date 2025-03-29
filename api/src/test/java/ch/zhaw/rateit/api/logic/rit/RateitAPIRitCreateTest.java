package ch.zhaw.rateit.api.logic.rit;

import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.entity.RitCreateRequest;
import ch.zhaw.rateit.api.logic.rit.repository.RitRepository;
import ch.zhaw.rateit.api.logic.rit.service.RitService;
import ch.zhaw.rateit.api.logic.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

public class RateitAPIRitCreateTest {

    private RitRepository ritRepository;
    private RitService ritService;

    private User testUser = new User("test@test.ch", "TestUser","$2a$12$fTeYfYBa6t0CwZsPpv79IOcEePccWixAEDa9kg3aJcoDNu1dIVokq");

    @BeforeEach
    void setUp() {
        ritRepository = mock(RitRepository.class);
        ritService = new RitService(ritRepository);
    }

    @Test
    void create_validRequest_savesRit() {
        RitCreateRequest request = new RitCreateRequest(
                "Test Rit",
                "data:image/jpeg;base64,validimage",
                "Details",
                false
        );

        Rit savedRit = new Rit("Test Rit", testUser, "data:image/jpeg;base64,validimage", "Details", false);
        when(ritRepository.save(any())).thenReturn(savedRit);

        Rit result = ritService.create(testUser, request);

        assertEquals("Test Rit", result.getName());
        assertEquals("TestUser", result.getUser().getDisplayName());
        assertEquals("Details", result.getDetails());
        verify(ritRepository, times(1)).save(any(Rit.class));
    }

    @Test
    void create_imageTooLarge_throwsException() {
        String tooLargeImage = "data:image/jpeg;base64," + "A".repeat(600_000);

        RitCreateRequest request = new RitCreateRequest("Name", tooLargeImage, "Details", false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                ritService.create(testUser, request)
        );

        assertTrue(ex.getMessage().contains("Image is too large"));
    }

    @Test
    void create_invalidImageFormat_throwsException() {
        RitCreateRequest request = new RitCreateRequest("Name", "notBase64Image", "Details", false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                ritService.create(testUser, request)
        );

        assertTrue(ex.getMessage().contains("Invalid image format"));
    }
}
