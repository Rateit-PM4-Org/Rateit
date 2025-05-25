package ch.zhaw.rateit.api.config.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Service for handling jwt tokens.
 * This service is used to generate, validate and extract information from jwt tokens.
 *
 * @author Achille Hünenberger
 */
@Service
public class JwtService {

    /**
     * Jwt secret key.
     * This key is used to sign the jwt token.
     */
    @Value("${security.jwt.secret}")
    private String secretKey;

    /**
     * Jwt expiration time in seconds.
     */
    @Value("${security.jwt.expiration}")
    private long jwtExpiration;

    /**
     * Extract the subject from a jwt token.
     *
     * @param token jwt token
     * @return username
     */
    public String extractSubject(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts a specific claim from a JWT token using the given claims resolver function.
     * This method allows for custom extraction logic based on the provided claims' resolver.
     *
     * @param token          the JWT token from which claims are to be extracted
     * @param claimsResolver a function defining the logic to extract a specific claim from the JWT's claims
     * @param <T>            the type of the desired claim to be returned
     * @return the extracted claim of type T
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Generates a JWT token for the given user details.
     *
     * @param userDetails the user details for which the token will be generated
     * @return the generated JWT token as a string
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Generates a JWT token for the specified user with optional additional claims.
     *
     * @param extraClaims a map of additional claims to be included in the token
     * @param userDetails the user details containing information about the user
     * @return the generated JWT token as a string
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {
        return Jwts
                .builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(getSignInKey())
                .compact();
    }

    /**
     * Validates a JWT token by checking its subject against the user's username
     * and ensuring the token is not expired.
     *
     * @param token       the JWT token to validate
     * @param userDetails the user details of the user the token is associated with
     * @return true if the token is valid; false otherwise
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractSubject(token);
            return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Checks whether the provided JWT token is expired.
     *
     * @param token the JWT token to be checked
     * @return true if the token is expired, false otherwise
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extracts the expiration date of the JWT token.
     *
     * @param token the JWT token from which the expiration date will be extracted
     * @return the expiration date of the token
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extracts all claims from the specified JWT token.
     * This method parses the token and retrieves its claims payload.
     *
     * @param token the JWT token from which all claims are to be extracted
     * @return the claims extracted from the token
     */
    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
