package ch.zhaw.rateit.api.logic.user.service;

import ch.zhaw.rateit.api.config.auth.JwtService;
import ch.zhaw.rateit.api.config.auth.TokenResponse;
import ch.zhaw.rateit.api.logic.user.entity.UserLoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

/**
 * Service for managing user-logins and tokens.
 *
 * @author Achille Hünenberger
 */
@Service
public class UserLoginService {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public UserLoginService(JwtService jwtService, AuthenticationManager authenticationManager, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    /**
     * This method authenticates the user using their email and password. If successful, it retrieves
     * the user details and generates a JWT token, which is then returned as a {@code TokenResponse}.
     *
     * @param userLoginRequest the user login request containing the email and password for authentication
     * @return a {@code TokenResponse} containing the generated JWT token
     */
    public TokenResponse verifyLoginAndGetToken(UserLoginRequest userLoginRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userLoginRequest.email(), userLoginRequest.password()));

        return new TokenResponse(jwtService.generateToken(userDetailsService.loadUserByUsername(userLoginRequest.email())));
    }
}
