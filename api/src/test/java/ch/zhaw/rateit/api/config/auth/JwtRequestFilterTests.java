package ch.zhaw.rateit.api.config.auth;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import ch.zhaw.rateit.api.logic.user.entity.User;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.io.IOException;

@ExtendWith(MockitoExtension.class)
class JwtRequestFilterTests {

    @Mock
    private JwtService jwtService;

    @Mock
    private UserDetailsService userDetailsService;

    @InjectMocks
    private JwtRequestFilter jwtRequestFilter;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    @BeforeEach
    void setUp() {
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldAllowRequestWithoutAuthorizationHeaderAndNotSetAuthentication() throws IOException, ServletException {
        jwtRequestFilter.doFilterInternal(request, response, (req, res) -> {});
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void shouldAuthenticateUserWithValidTokenAndSetSecurityContext() throws IOException, ServletException {
        String token = "validToken";
        String userEmail = "test@test.ch";
        UserDetails userDetails = new User(userEmail, "test", "test");

        request.addHeader("Authorization", "Bearer " + token);
        when(jwtService.extractSubject(token)).thenReturn(userEmail);
        when(userDetailsService.loadUserByUsername(userEmail)).thenReturn(userDetails);
        when(jwtService.isTokenValid(token, userDetails)).thenReturn(true);

        jwtRequestFilter.doFilterInternal(request, response, (req, res) -> {});
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals(userEmail, SecurityContextHolder.getContext().getAuthentication().getName());
        assertEquals(userDetails, SecurityContextHolder.getContext().getAuthentication().getPrincipal());
    }
}