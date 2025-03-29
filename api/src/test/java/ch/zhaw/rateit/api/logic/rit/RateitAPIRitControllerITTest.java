package ch.zhaw.rateit.api.logic.rit;

import ch.zhaw.rateit.api.config.WebsecurityConfig;
import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.entity.RitCreateRequest;
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
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@Import(WebsecurityConfig.class)
class RitControllerIntegrationTest extends AbstractBaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RitRepository ritRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser = new User("test@test.ch", "TestUser", "$2a$12$fTeYfYBa6t0CwZsPpv79IOcEePccWixAEDa9kg3aJcoDNu1dIVokq");

    @BeforeEach
    void setup() {
        userRepository.deleteAll();
        ritRepository.deleteAll();
        testUser.setEmailVerified(true);
        userRepository.save(testUser);
    }

    @Test
    void createRit_positive_returnsCreatedRit() throws Exception {
        RitCreateRequest request = new RitCreateRequest(
                "Test Rit",
                "data:image/jpeg;base64,someimage",
                "Some details",
                false
        );

        String requestJson = objectMapper.writeValueAsString(request);

        String response = mockMvc.perform(post("/rit/create")
                        .with(user(testUser))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Rit"))
                .andExpect(jsonPath("$.details").value("Some details"))
                .andReturn().getResponse().getContentAsString();

        Rit created = objectMapper.readValue(response, Rit.class);
        assertNotNull(created.getId());
        assertEquals("Test Rit", created.getName());
        assertEquals(testUser.getId(), created.getUser().getId());
    }

    @Test
    void createRit_negative_imageTooLarge_returnsBadRequest() throws Exception {
        String largeImage = "data:image/jpeg;base64," + "A".repeat(600_000);

        RitCreateRequest request = new RitCreateRequest(
                "Big Rit",
                largeImage,
                "Should fail",
                false
        );

        String requestJson = objectMapper.writeValueAsString(request);

        mockMvc.perform(post("/rit/create")
                        .with(user(testUser))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createRit_negative_unauthorized_returnsForbidden() throws Exception {
        RitCreateRequest request = new RitCreateRequest(
                "Unauthorized Rit",
                "data:image/jpeg;base64,xyz",
                "Should be blocked",
                false
        );

        String requestJson = objectMapper.writeValueAsString(request);

        mockMvc.perform(post("/rit/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isForbidden());
    }
}
