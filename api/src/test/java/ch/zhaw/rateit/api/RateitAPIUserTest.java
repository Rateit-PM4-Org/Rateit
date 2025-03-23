package ch.zhaw.rateit.api;

import ch.zhaw.rateit.api.logic.user.repository.UserRepository;
import ch.zhaw.rateit.api.config.WebsecurityConfig;
import ch.zhaw.rateit.api.util.AbstractBaseIntegrationTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@Import(WebsecurityConfig.class)
public class RateitAPIUserTest extends AbstractBaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void cleanDatabase() {
        userRepository.deleteAll();
    }
    @Test
    void endpointRegisterPositive() throws Exception {
        String email = "test@example.com";
        String displayName = "TestUser";

        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "email": "%s",
                            "displayName": "%s",
                            "cleanPassword": "mostSecurePassword"
                        }
                        """.formatted(email, displayName)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.displayName").value(displayName));
    }

    @Test
    void endpointRegisterPositiveDisplaynameAlreadyExists() throws Exception {
        String displayName = "TestUser";
        String email1 = "test1@example.com";
        String email2 = "test2@example.com";

        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "email": "%s",
                            "displayName": "%s",
                            "cleanPassword": "mostSecurePassword1"
                        }
                        """.formatted(email1, displayName)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email1))
                .andExpect(jsonPath("$.displayName").value(displayName));

        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "email": "%s",
                            "displayName": "%s",
                            "cleanPassword": "mostSecurePassword2"
                        }
                        """.formatted(email2, displayName)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email2))
                .andExpect(jsonPath("$.displayName").value(displayName));
    }

    @Test
    void endpointRegisterNegativeEmailAlreadyExisting() throws Exception {
        String email = "test@example.com";

        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "email": "%s",
                            "displayName": "TestUser1",
                            "cleanPassword": "mostSecurePassword1"
                        }
                        """.formatted(email)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email));

        Exception exception = assertThrows(Exception.class, () -> {
            mockMvc.perform(post("/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("""
                            {
                                "email": "%s",
                                "displayName": "TestUser2",
                                "cleanPassword": "mostSecurePassword2"
                            }
                            """.formatted(email)))
                    .andExpect(status().isBadRequest());
        });

        assertTrue(exception.getMessage().contains("User with email " + email + " already exists"));
    }
}
