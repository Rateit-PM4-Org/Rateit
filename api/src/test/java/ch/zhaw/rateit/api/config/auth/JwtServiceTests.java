package ch.zhaw.rateit.api.config.auth;

import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.util.AbstractBaseIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class JwtServiceTests extends AbstractBaseIntegrationTest {

    @Autowired
    JwtService jwtService;

    UserDetails validUser = new User("test@example.com", "Test User", "password");

    @Test
    void testGenerateToken() {
        String token = jwtService.generateToken(validUser);
        assertNotNull(token);
        String[] parts = token.split("\\.");
        assertEquals(3, parts.length);
    }

    @Test
    void testExtractSubject() {
        UserDetails user = validUser;
        String token = jwtService.generateToken(user);
        String username = jwtService.extractSubject(token);
        assertEquals(user.getUsername(), username);
    }

    @Test
    void testIsTokenValid() {
        UserDetails user = validUser;
        String token = jwtService.generateToken(user);
        assertTrue(jwtService.isTokenValid(token, user));
    }

    @Test
    void testIsTokenInvalid_WrongUser() {
        UserDetails user = validUser;
        String token = jwtService.generateToken(user);
        UserDetails wrongUser = new User("wrong@example.com", "Test User", "password");
        assertFalse(jwtService.isTokenValid(token, wrongUser));
    }

    @Test
    void testIsTokenInvalid_Expired() {
        UserDetails user = validUser;
        String token = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzQyOTM0MjM2LCJleHAiOjE3NDI5MzQyMzd9.h9TWNOvW2r-bjTXE1uEwQhWyQSyGee8GVd0RLTJse6156yt7oarPuB50DES11fIx";
        assertFalse(jwtService.isTokenValid(token, user));
    }

    @Test
    void testIsTokenInvalid_Signature() {
        UserDetails user = validUser;
        String token = jwtService.generateToken(user);

        // manipulate token by removing a character from the signature
        token = token.substring(0, token.length() - 1);

        assertFalse(jwtService.isTokenValid(token, user));
    }

}
