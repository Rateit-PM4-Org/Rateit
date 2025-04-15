package ch.zhaw.rateit.api.logic.user;

import ch.zhaw.rateit.api.exceptions.types.ValidationExceptionWithField;
import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.logic.user.entity.UserRegistrationRequest;
import ch.zhaw.rateit.api.logic.user.repository.UserRepository;
import ch.zhaw.rateit.api.config.WebsecurityConfig;
import ch.zhaw.rateit.api.util.AbstractBaseIntegrationTest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@Import(WebsecurityConfig.class)
class RateitAPIUserRegistrationTest extends AbstractBaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PasswordEncoder passwordEncrypter;

    @BeforeEach
    void cleanDatabase() {
        userRepository.deleteAll();
    }
    @Test
    void endpointRegisterPositive() throws Exception {
        String email = "test@example.com";
        String displayName = "TestUser";
        String cleanPassword = "mostSecurePassword1!";
        UserRegistrationRequest userRegistrationRequest = new UserRegistrationRequest(email, displayName, cleanPassword);
        String requestBody = objectMapper.writeValueAsString(userRegistrationRequest);

        String result = mockMvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andReturn()
                .getResponse()
                .getContentAsString();

        User resultObject = objectMapper.readValue(result, User.class);
        assertNotNull(resultObject);
        assertEquals(email, resultObject.getEmail());
        assertEquals(displayName, resultObject.getDisplayName());
    }

    @Test
    void endpointRegisterPositiveDisplaynameAlreadyExists() throws Exception {
        String displayName = "TestUser";
        String email2 = "test2@example.com";
        String cleanPassword = "mostSecurePassword2!";
        UserRegistrationRequest userRegistrationRequest = new UserRegistrationRequest(email2, displayName, cleanPassword);
        String requestBody = objectMapper.writeValueAsString(userRegistrationRequest);

        User user = new User("test1@example.com", "TestUser1", "mostSecurePassword1!");
        userRepository.save(user);

        String result = mockMvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andReturn()
                .getResponse()
                .getContentAsString();

        User resultObject = objectMapper.readValue(result, User.class);
        assertNotNull(resultObject);
        assertEquals(email2, resultObject.getEmail());
        assertEquals(displayName, resultObject.getDisplayName());
    }

    @Test
    void registeredUserValidatePasswordHash() throws Exception {
        String displayName = "TestUser";
        String email2 = "test2@example.com";
        String cleanPassword = "mostSecurePassword2!";
        UserRegistrationRequest userRegistrationRequest = new UserRegistrationRequest(email2, displayName, cleanPassword);
        String requestBody = objectMapper.writeValueAsString(userRegistrationRequest);

        User user = new User("test1@example.com", "TestUser1", "mostSecurePassword1!");
        userRepository.save(user);

        mockMvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody));

        User savedUser = userRepository.findByEmail(email2).get();
        assertTrue(passwordEncrypter.matches(cleanPassword, savedUser.getHashedPassword()));
    }

    @Test
    void endpointRegisterNegativeEmailAlreadyExisting() throws Exception {
        String email = "test@example.com";
        UserRegistrationRequest userRegistrationRequest = new UserRegistrationRequest(email, "TestUser2", "mostSecurePassword2!");
        String requestBody = objectMapper.writeValueAsString(userRegistrationRequest);

        User user = new User(email, "TestUser1", "mostSecurePassword1!");
        userRepository.save(user);

        Exception resolvedException = mockMvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andReturn().getResolvedException();

        assertNotNull(resolvedException);
        assertInstanceOf(ValidationExceptionWithField.class, resolvedException);
    }

    static Stream<Arguments> provideInvalidRegisterRequests() {
        return Stream.of(
                Arguments.of("test", "display name", "goodPassword1!"), // Invalid email
                Arguments.of("", "display name", "goodPassword1!"),      // Missing email
                Arguments.of("test@test.ch", "", "goodPassword1!"), // Missing displayname
                Arguments.of("test@test.ch", "display name", "") , // Missing password
                Arguments.of("test@test.ch", "display name", "shortPW"),  // Password to short
                Arguments.of("test@test.ch", "display name", "badPassword1"),  // Password missing special characters
                Arguments.of("test@test.ch", "display name", "badPassword!"),  // Password missing number
                Arguments.of("test@test.ch", "display name", "badpassword1!"),  // Password missing uppercase letter
                Arguments.of("test@test.ch", "display name", "BADPASSWORD1!"),  // Password missing lowercase letter
                Arguments.of("test@test.ch", "display name", "good Password1!")  // Space in password
        );
    }

    @ParameterizedTest
    @MethodSource("provideInvalidRegisterRequests")
    void endpointRegisterInvalidCredentials(String email, String displayName, String cleanPassword) throws Exception {
        UserRegistrationRequest userRegistrationRequest = new UserRegistrationRequest(email, displayName, cleanPassword);
        String requestBody = objectMapper.writeValueAsString(userRegistrationRequest);

        mockMvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }
}
