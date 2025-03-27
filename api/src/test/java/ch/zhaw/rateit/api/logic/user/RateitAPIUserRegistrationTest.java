package ch.zhaw.rateit.api.logic.user;

import ch.zhaw.rateit.api.exceptions.types.DuplicateEmailUserException;
import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.logic.user.entity.UserRegistrationRequest;
import ch.zhaw.rateit.api.logic.user.repository.UserRepository;
import ch.zhaw.rateit.api.config.WebsecurityConfig;
import ch.zhaw.rateit.api.util.AbstractBaseIntegrationTest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

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
        String cleanPassword = "mostSecurePassword";
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
        String cleanPassword = "mostSecurePassword2";
        UserRegistrationRequest userRegistrationRequest = new UserRegistrationRequest(email2, displayName, cleanPassword);
        String requestBody = objectMapper.writeValueAsString(userRegistrationRequest);

        User user = new User("test1@example.com", "TestUser1", "mostSecurePassword1");
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
        String cleanPassword = "mostSecurePassword2";
        UserRegistrationRequest userRegistrationRequest = new UserRegistrationRequest(email2, displayName, cleanPassword);
        String requestBody = objectMapper.writeValueAsString(userRegistrationRequest);

        User user = new User("test1@example.com", "TestUser1", "mostSecurePassword1");
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
        UserRegistrationRequest userRegistrationRequest = new UserRegistrationRequest(email, "TestUser2", "mostSecurePassword2");
        String requestBody = objectMapper.writeValueAsString(userRegistrationRequest);

        User user = new User(email, "TestUser1", "mostSecurePassword1");
        userRepository.save(user);

        Exception resolvedException = mockMvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andReturn().getResolvedException();

        assertNotNull(resolvedException);
        assertInstanceOf(DuplicateEmailUserException.class, resolvedException);
        assertTrue(resolvedException.getMessage().contains("User with email " + email + " already exists"));
    }
}
