package ch.zhaw.rateit.api.logic.rit;

import ch.zhaw.rateit.api.config.WebsecurityConfig;
import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.repository.RitRepository;
import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.logic.user.repository.UserRepository;
import ch.zhaw.rateit.api.util.AbstractBaseIntegrationTest;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
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
                Arguments.of("TestRit", "Details", "true"), // published
                Arguments.of("TestRit", "Details", "false"), // not published
                Arguments.of("TestRit", null, "true") // details null
        );
    }

    @ParameterizedTest
    @MethodSource("provideValidRitCreateParams")
    void createRit_positive_returnsStatusOk(String name, String details, String published) throws Exception {
        MockMultipartFile file = new MockMultipartFile("images", "test.jpg", "image/jpeg", "img".getBytes());

        mockMvc.perform(multipart("/rit/create")
                        .file(file)
                        .param("name", name)
                        .param("details", details)
                        .param("published", published)
                        .with(user(testUser)))
                .andExpect(status().is2xxSuccessful());
    }

    private static Stream<Arguments> provideInvalidRitCreateParams() {
        return Stream.of(
                Arguments.of("", "Details", "false"), // name blank
                Arguments.of("   ", "Details", "false"), // name blank with spaces
                Arguments.of(null, "Details", "false"), // name null
                Arguments.of("TestRit", "Details", "notPublished"), // invalid published value
                Arguments.of("TestRit", "Details", null) // published null
        );
    }

    @ParameterizedTest
    @MethodSource("provideInvalidRitCreateParams")
    void createRit_negative_returnsBadRequest(String name, String details, String published) throws Exception {
        MockMultipartFile file = new MockMultipartFile("images", "test.jpg", "image/jpeg", "img".getBytes());

        mockMvc.perform(multipart("/rit/create")
                        .file(file)
                        .param("name", name)
                        .param("details", details)
                        .param("published", published)
                        .with(user(testUser)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createRit_negative_imageTooLarge_returnsBadRequest() throws Exception {
        byte[] largeContent = "A".repeat(9 * 1024 * 1024).getBytes(); // 9 MB

        MockMultipartFile image = new MockMultipartFile("images", "large.jpg", "image/jpeg", largeContent);

        String responseBody = mockMvc.perform(multipart("/rit/create")
                        .file(image)
                        .param("name", "Test Rit")
                        .param("details", "Some details")
                        .param("published", "false")
                        .with(user(testUser)))
                .andExpect(status().isBadRequest())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Map<String, Object> responseMap = objectMapper.readValue(responseBody, new TypeReference<>() {
        });
    }

    @Test
    void createRit_negative_tooManyImages_returnsBadRequest() throws Exception {

        MockMultipartFile file1 = new MockMultipartFile("images", "img1.jpg", "image/jpeg", "x".getBytes());
        MockMultipartFile file2 = new MockMultipartFile("images", "img2.jpg", "image/jpeg", "x".getBytes());
        MockMultipartFile file3 = new MockMultipartFile("images", "img3.jpg", "image/jpeg", "x".getBytes());
        MockMultipartFile file4 = new MockMultipartFile("images", "img4.jpg", "image/jpeg", "x".getBytes());

        String responseBody = mockMvc.perform(multipart("/rit/create")
                        .file(file1)
                        .file(file2)
                        .file(file3)
                        .file(file4)
                        .param("name", "Test Rit")
                        .param("details", "Some details")
                        .param("published", "false")
                        .with(user(testUser)))
                .andExpect(status().isBadRequest())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Map<String, Object> responseMap = objectMapper.readValue(responseBody, new TypeReference<>() {
        });
    }

    @Test
    void createRit_negative_unauthorized_returnsForbidden() throws Exception {
        MockMultipartFile image = new MockMultipartFile("images", "test.jpg", "image/jpeg", "img".getBytes());

        mockMvc.perform(multipart("/rit/create")
                        .file(image)
                        .param("name", "Unauthorized Rit")
                        .param("details", "No access")
                        .param("published", "false"))
                .andExpect(status().isForbidden());
    }

    @Test
    void createRit_positive_setsTimestamps() throws Exception {
        MockMultipartFile image = new MockMultipartFile("images", "img.jpg", "image/jpeg", "img".getBytes());

        String response = mockMvc.perform(multipart("/rit/create")
                        .file(image)
                        .param("name", "With Timestamps")
                        .param("details", "Test createdAt/updatedAt")
                        .param("published", "false")
                        .with(user(testUser)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String id = objectMapper.readTree(response).get("id").asText();
        Rit rit = ritRepository.findById(id).orElseThrow();

        assertNotNull(rit, "Rit must be present in the database");
        assertNotNull(rit.getCreatedAt(), "createdAt must be set");
        assertNotNull(rit.getUpdatedAt(), "updatedAt must be set");
        assertEquals(rit.getCreatedAt(), rit.getUpdatedAt(), "createdAt and updatedAt must be equal after creation");
    }

}
