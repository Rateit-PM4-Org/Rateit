package ch.zhaw.rateit.api.logic.user;

import ch.zhaw.rateit.api.config.WebsecurityConfig;
import ch.zhaw.rateit.api.config.auth.TokenResponse;
import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.logic.user.entity.UserLoginRequest;
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

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@Import(WebsecurityConfig.class)
class RateitAPIUserLoginTest extends AbstractBaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser = new User("test@test.ch", "TestUser", "$2a$12$fTeYfYBa6t0CwZsPpv79IOcEePccWixAEDa9kg3aJcoDNu1dIVokq"); //pw: test

    @BeforeEach
    void cleanDatabase() {
        userRepository.deleteAll();
        testUser.setEmailVerified(true);
        userRepository.save(testUser);
    }

    @Test
    void endpointLoginPositive() throws Exception {
        UserLoginRequest userLoginRequest = new UserLoginRequest("test@test.ch", "test");
        String requestBody = objectMapper.writeValueAsString(userLoginRequest);

        String result = mockMvc.perform(post("/api/users/login").contentType(MediaType.APPLICATION_JSON).content(requestBody)).andExpect(status().is2xxSuccessful()).andReturn().getResponse().getContentAsString();

        TokenResponse tokenResponse = objectMapper.readValue(result, TokenResponse.class);
        assertNotNull(tokenResponse);
        assertNotNull(tokenResponse.token());
    }

    @Test
    void endpointLoginNegativeInvalidCredentials() throws Exception {
        UserLoginRequest userLoginRequest = new UserLoginRequest("test@test.ch", "wrongPW");
        String requestBody = objectMapper.writeValueAsString(userLoginRequest);

        mockMvc.perform(post("/api/users/login").contentType(MediaType.APPLICATION_JSON).content(requestBody))
                .andExpect(status().isForbidden());
    }

    static Stream<Arguments> provideInvalidLoginRequests() {
        return Stream.of(
                Arguments.of("test", "wrongPW"), // Invalid email
                Arguments.of("", "wrongPW"),      // Missing email
                Arguments.of("test@test.ch", "")  // Missing password
        );
    }

    @ParameterizedTest
    @MethodSource("provideInvalidLoginRequests")
    void endpointLoginNegative(String email, String password) throws Exception {
        UserLoginRequest userLoginRequest = new UserLoginRequest(email, password);
        String requestBody = objectMapper.writeValueAsString(userLoginRequest);

        mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    void endpointMePositive() throws Exception {
        String result = mockMvc.perform(get("/api/users/me").contentType(MediaType.APPLICATION_JSON).with(user(testUser))).andReturn().getResponse().getContentAsString();

        User userResponse = objectMapper.readValue(result, User.class);
        assertNotNull(userResponse);
        assertEquals(testUser.getEmail(), userResponse.getEmail());
        assertEquals(testUser.getDisplayName(), userResponse.getDisplayName());
    }

    @Test
    void endpointMeNegative() throws Exception {
        mockMvc.perform(get("/api/users/me").contentType(MediaType.APPLICATION_JSON)).andExpect(status().isForbidden());
    }

}
