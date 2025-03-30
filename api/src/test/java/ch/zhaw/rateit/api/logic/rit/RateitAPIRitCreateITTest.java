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
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@Import(WebsecurityConfig.class)
class RateitAPIRitCreateITTest extends AbstractBaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RitRepository ritRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private final User testUser = new User("test@test.ch", "TestUser", "$2a$12$fTeYfYBa6t0CwZsPpv79IOcEePccWixAEDa9kg3aJcoDNu1dIVokq");

    @BeforeEach
    void setup() {
        userRepository.deleteAll();
        ritRepository.deleteAll();
        testUser.setEmailVerified(true);
        userRepository.save(testUser);
    }

    private static Stream<Arguments> provideValidRitCreateParams() {
        return Stream.of(
                Arguments.of("TestRit", "Details", true), // published
                Arguments.of("TestRit", "Details", false), // not published
                Arguments.of("TestRit", null, true) // details null
        );
    }

    @ParameterizedTest
    @MethodSource("provideValidRitCreateParams")
    void createRit_positive_returnsStatusOk(String name, String details, Boolean published) throws Exception {
        String input = objectMapper.writeValueAsString(new RitCreateRequest(name, details, null, published));

        mockMvc.perform(post("/rit/create").content(input).contentType(MediaType.APPLICATION_JSON)
                        .with(user(testUser)))
                .andExpect(status().is2xxSuccessful());
    }

    private static Stream<Arguments> provideInvalidRitCreateParams() {
        return Stream.of(
                Arguments.of("", "Details", false), // name blank
                Arguments.of("   ", "Details", false), // name blank with spaces
                Arguments.of(null, "Details", false), // name null
                Arguments.of("TestRit", "Details", null) // published null
        );
    }

    @ParameterizedTest
    @MethodSource("provideInvalidRitCreateParams")
    void createRit_negative_returnsBadRequest(String name, String details, Boolean published) throws Exception {
        String input = objectMapper.writeValueAsString(new RitCreateRequest(name, details, null, published));

        mockMvc.perform(post("/rit/create").content(input).contentType(MediaType.APPLICATION_JSON)
                        .with(user(testUser)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createRit_negative_unauthorized_returnsForbidden() throws Exception {
        String input = objectMapper.writeValueAsString(new RitCreateRequest("test", "details", null, false));

        mockMvc.perform(post("/rit/create").content(input).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void createRit_positive_setsTimestamps() throws Exception {
        String input = objectMapper.writeValueAsString(new RitCreateRequest("test", "details", null, false));

        String response = mockMvc.perform(post("/rit/create").content(input).contentType(MediaType.APPLICATION_JSON)
                        .with(user(testUser)))
                .andExpect(status().is2xxSuccessful()).andReturn().getResponse().getContentAsString();

        String id = objectMapper.readTree(response).get("id").asText();
        Rit rit = ritRepository.findById(id).orElseThrow();

        assertNotNull(rit, "Rit must be present in the database");
        assertNotNull(rit.getCreatedAt(), "createdAt must be set");
        assertNotNull(rit.getUpdatedAt(), "updatedAt must be set");
        assertEquals(rit.getCreatedAt(), rit.getUpdatedAt(), "createdAt and updatedAt must be equal after creation");
    }

}
