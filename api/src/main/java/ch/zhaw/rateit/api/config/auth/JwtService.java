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
     * Extract a claim from a jwt token.
     * The claim is extracted using the given resolver function.
     *
     * @param token
     * @param claimsResolver
     * @return
     * @param <T>
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Generate a jwt token for the given user.
     *
     * @param userDetails
     * @return
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Generate a jwt token for the given user with extra claims.
     *
     * @param extraClaims
     * @param userDetails
     * @return
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
                .expiration(new Date(System.currentTimeMillis() + expiration*1000))
                .signWith(getSignInKey())
                .compact();
    }

    /**
     * Check if a jwt token is valid for the given user.
     *
     * @param token
     * @param userDetails
     * @return
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractSubject(token);
            return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
        }catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if a jwt token is expired.
     *
     * @param token
     * @return
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extract the expiration date from a jwt token.
     *
     * @param token
     * @return
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extract all claims from a jwt token.
     * => Throws an exception if the token is invalid or unverifiable.
     *
     * @param token
     * @return
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
