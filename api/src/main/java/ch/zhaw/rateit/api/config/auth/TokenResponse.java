package ch.zhaw.rateit.api.config.auth;

/**
 * API-Response containing an Access-Token
 *
 * @author Achille Hünenberger
 */
public class TokenResponse {
    private String token;

    public TokenResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
