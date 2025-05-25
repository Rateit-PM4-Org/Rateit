package ch.zhaw.rateit.api.logic.user;

import ch.zhaw.rateit.api.config.WebsecurityConfig;
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
import org.springframework.test.web.servlet.MockMvc;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@Import(WebsecurityConfig.class)
class RateitAPIUserVerificationTest extends AbstractBaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser = new User("test@test.ch", "TestUser", "$2a$12$fTeYfYBa6t0CwZsPpv79IOcEePccWixAEDa9kg3aJcoDNu1dIVokq"); //pw: test

    static Stream<Arguments> provideInvalidVerificationRequests() {
        return Stream.of(
                Arguments.of("")   // Empty Token
        );
    }

    @BeforeEach
    void cleanDatabase() {
        userRepository.deleteAll();
    }

    @Test
    void verifyUserPositive() throws Exception {
        testUser.setEmailVerified(false);
        testUser.setEmailVerificationToken("testToken");

        userRepository.save(testUser);

        mockMvc.perform(get("/api/users/mail-confirmation").param("token", "testToken").param("email", testUser.getEmail())).andExpect(
                status().is2xxSuccessful());

        User user = userRepository.findByEmail(testUser.getEmail()).get();
        assertTrue(user.isEmailVerified());
        assertTrue(user.isEnabled());

    }

    @ParameterizedTest
    @MethodSource("provideInvalidVerificationRequests")
    void verifyUserNegative(String token) throws Exception {
        testUser.setEmailVerified(false);
        testUser.setEmailVerificationToken("testToken");

        userRepository.save(testUser);

        mockMvc.perform(get("/api/users/mail-confirmation").param("token", token)).andExpect(
                status().isBadRequest());
    }
}
