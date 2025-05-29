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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@Import(WebsecurityConfig.class)
class RateitAPIRitGetAllITTest extends AbstractBaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RitRepository ritRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private final User testUser = new User("test@test.ch", "TestUser", "$2a$12$hashed");

    private final User otherUser = new User("other@test.ch", "OtherUser", "$2a$12$hashed");

    @BeforeEach
    void setup() throws InterruptedException {
        userRepository.deleteAll();
        ritRepository.deleteAll();
        testUser.setEmailVerified(true);
        otherUser.setEmailVerified(true);
        userRepository.saveAll(List.of(testUser, otherUser));

        ritRepository.saveAll(List.of(
                new Rit("Rit1", "Details1", List.of("tag1"), List.of("code1"), testUser),
                new Rit("OtherUserRit", "OtherDetails", List.of("tag3"), List.of("code3"), otherUser)
        ));
        // Simulate a delay to ensure the second rit is created after the first one
        Thread.sleep(1000);
        ritRepository.save(new Rit("Rit2", "Details2", List.of("tag2"), List.of("code2"), testUser));
    }

    @Test
    void getAllRits_authenticated_returnsOnlyOwnRits() throws Exception {
        String response = mockMvc.perform(get("/api/rits")
                        .with(user(testUser))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        List<Rit> rits = objectMapper.readValue(response, new TypeReference<>() {
        });

        assertEquals(2, rits.size(), "Only Rits owned by the testUser should be returned");
        assertTrue(rits.stream().allMatch(r -> r.getOwner().getId().equals(testUser.getId())));
        // Check that the order is correct
        assertEquals("Rit2", rits.get(0).getName(), "First rit should be Rit2 (as it was updated last)");
        assertEquals("Rit1", rits.get(1).getName(), "Second rit should be Rit1");
    }

    @Test
    void getAllRits_unauthenticated_returnsForbidden() throws Exception {
        mockMvc.perform(get("/api/rits").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void getAllRits_authenticatedNoRits_returnsEmptyList() throws Exception {
        User newUser = new User("newuser@test.ch", "NewUser", "$2a$12$hashed");
        newUser.setEmailVerified(true);
        userRepository.save(newUser);

        String response = mockMvc.perform(get("/api/rits")
                        .with(user(newUser))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        List<Rit> rits = objectMapper.readValue(response, new TypeReference<>() {
        });
        assertTrue(rits.isEmpty(), "User without rits should receive an empty list");
    }
}