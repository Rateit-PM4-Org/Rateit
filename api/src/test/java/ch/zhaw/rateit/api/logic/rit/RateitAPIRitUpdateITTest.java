package ch.zhaw.rateit.api.logic.rit;

import ch.zhaw.rateit.api.config.WebsecurityConfig;
import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.entity.RitUpdateRequest;
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

import java.util.List;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@Import(WebsecurityConfig.class)
class RateitAPIRitUpdateITTest extends AbstractBaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RitRepository ritRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private final User testUser = new User("test@test.ch", "TestUser", "$2a$12$fTeYfYBa6t0CwZsPpv79IOcEePccWixAEDa9kg3aJcoDNu1dIVokq");

    private final Rit testRit = new Rit("TestRit", "Details", null, null, testUser);

    private Rit inputTestRit = new Rit();

    private static Stream<Arguments> provideValidRitUpdateParams() {
        return Stream.of(Arguments.of("TestRit-Updated", "Details", List.of("tag1", "tag2"), List.of()), // name updated
                Arguments.of("TestRit", "Details-Updated", List.of("tag1"), List.of()), // details updated
                Arguments.of("TestRit", null, List.of("tag1"), List.of()), // details updated
                Arguments.of("TestRit-Updated", null, List.of("tag1"), List.of()), // details and name updated
                Arguments.of("TestRit-Updated", null, List.of("tag1", "tag2, tag3"), List.of()), // all updated
                Arguments.of("TestRit", "Details", List.of("tag1", "tag2"), List.of()), // none updated
                Arguments.of("TestRit", "Details", List.of("tag1", "tag2"), List.of("code1")), // single code set
                Arguments.of("TestRit", "Details", List.of("tag1", "tag2"), List.of("code1", "code2")) // multiple codes set
        );
    }

    private static Stream<Arguments> provideInvalidRitUpdateParams() {
        return Stream.of(Arguments.of("", "Details", List.of(), List.of()), // name blank
                Arguments.of("   ", "Details", List.of(), List.of()), // name blank with spaces
                Arguments.of(null, "Details", List.of(), List.of()), // name null
                Arguments.of("TestRit", "Details", null, List.of()), // tags null
                Arguments.of("TestRit", "Details", List.of(), null) // codes null
        );
    }

    @BeforeEach
    void setup() {
        userRepository.deleteAll();
        ritRepository.deleteAll();
        testUser.setEmailVerified(true);
        userRepository.save(testUser);
        inputTestRit = ritRepository.save(testRit);
    }

    @ParameterizedTest
    @MethodSource("provideValidRitUpdateParams")
    void updateRit_positive_returnsStatusOk(String name, String details, List<String> tags, List<String> codes) throws Exception {
        String input = objectMapper.writeValueAsString(new RitUpdateRequest(name, details, tags, codes));

        var resultActions = mockMvc.perform(put("/api/rits/" + inputTestRit.getId()).content(input).contentType(MediaType.APPLICATION_JSON).with(user(testUser)));
        String result = resultActions.andReturn().getResponse().getContentAsString();

        resultActions.andExpect(status().is2xxSuccessful());
        Rit updatedRit = objectMapper.readValue(result, Rit.class);
        assertTrue(updatedRit.getUpdatedAt().isAfter(inputTestRit.getUpdatedAt()), "updatedAt should be updated");
        assertNotNull(updatedRit, "Rit must be present in the database");
        assertEquals(name, updatedRit.getName(), "Rit name must be equal to the input name");
        assertEquals(details, updatedRit.getDetails(), "Rit details must be equal to the input details");
        assertEquals(tags, updatedRit.getTags(), "Rit tags must be equal to the input tags");
        assertFalse(updatedRit.isPublished(), "Rit must not be published");
        assertEquals(testUser.getId(), updatedRit.getOwner().getId(), "Rit owner must be equal to the input owner");
    }

    @ParameterizedTest
    @MethodSource("provideInvalidRitUpdateParams")
    void updateRit_negative_returnsBadRequest(String name, String details, List<String> tags, List<String> codes) throws Exception {
        String input = objectMapper.writeValueAsString(new RitUpdateRequest(name, details, tags, codes));

        mockMvc.perform(put("/api/rits/" + inputTestRit.getId()).content(input).contentType(MediaType.APPLICATION_JSON).with(user(testUser))).andExpect(status().isBadRequest());
    }

    @Test
    void updateRit_negative_unauthorized_returnsForbidden() throws Exception {
        String input = objectMapper.writeValueAsString(new RitUpdateRequest("test", "details", List.of(), List.of("code1")));

        mockMvc.perform(put("/api/rits/" + inputTestRit.getId()).content(input).contentType(MediaType.APPLICATION_JSON)).andExpect(status().isForbidden());
    }

    @Test
    void updateRit_negative_RitNotPresent() throws Exception {
        String input = objectMapper.writeValueAsString(new RitUpdateRequest("test", "details", List.of(), List.of("code1")));

        mockMvc.perform(put("/api/rits/123").content(input).contentType(MediaType.APPLICATION_JSON).with(user(testUser))).andExpect(status().isNotFound());
    }

    @Test
    void updateRit_negative_RitNotCorrectOwner() throws Exception {
        User otherOwner = new User("other", "other", "other");
        otherOwner.setEmailVerified(true);
        userRepository.save(otherOwner);
        testRit.setOwner(otherOwner);
        Rit rit = ritRepository.save(testRit);

        String input = objectMapper.writeValueAsString(new RitUpdateRequest("test", "details", List.of(), List.of("code1")));

        mockMvc.perform(put("/api/rits/" + rit.getId()).content(input).contentType(MediaType.APPLICATION_JSON).with(user(testUser))).andExpect(status().isForbidden());
    }
}
