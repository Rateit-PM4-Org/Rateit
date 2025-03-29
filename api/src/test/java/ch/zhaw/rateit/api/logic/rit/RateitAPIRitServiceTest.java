package ch.zhaw.rateit.api.logic.rit;

import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.entity.RitCreateRequest;
import ch.zhaw.rateit.api.logic.rit.repository.RitRepository;
import ch.zhaw.rateit.api.logic.rit.service.RitService;
import ch.zhaw.rateit.api.logic.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class RitServiceTest {

    private RitRepository ritRepository;
    private RitService ritService;

    @BeforeEach
    void setUp() {
        ritRepository = mock(RitRepository.class);
        ritService = new RitService(ritRepository);
    }

    @Test
    void create_validRequest_savesRit() {

        User user = new User("max", "123", "blabla");

        RitCreateRequest request = new RitCreateRequest(
                "Test Rit",
                "data:image/jpeg;base64,validimage",
                "Details",
                false
        );

        Rit savedRit = new Rit("Test Rit", "123", "data:image/jpeg;base64,validimage", "Details", false);
        when(ritRepository.save(any())).thenReturn(savedRit);

        Rit result = ritService.create(user, request);

        assertEquals("Test Rit", result.getName());
        assertEquals("123", result.getUserId());
        assertEquals("Details", result.getDetails());
        verify(ritRepository, times(1)).save(any(Rit.class));
    }

    @Test
    void create_imageTooLarge_throwsException() {
        User user = new User("max", "123", "blabla");

        String tooLargeImage = "data:image/jpeg;base64," + "A".repeat(600_000);

        RitCreateRequest request = new RitCreateRequest("Name", tooLargeImage, "Details", false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                ritService.create(user, request)
        );

        assertTrue(ex.getMessage().contains("Image is too large"));
    }

    @Test
    void create_invalidImageFormat_throwsException() {
        User user = new User("max", "123", "blabla");

        RitCreateRequest request = new RitCreateRequest("Name", "notBase64Image", "Details", false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                ritService.create(user, request)
        );

        assertTrue(ex.getMessage().contains("Invalid image format"));
    }
}
