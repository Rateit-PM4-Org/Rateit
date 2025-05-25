package ch.zhaw.rateit.api.config;

import ch.zhaw.rateit.api.config.auth.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

/**
 * Configuration class for enabling and customizing web security settings in the application.
 * This class is configured to work with Spring Security to define authorization rules,
 * cross-origin settings, and integrate JWT-based authentication.
 *
 * @author Achille Hünenberger
 */
@Configuration
@EnableWebSecurity
public class WebsecurityConfig {
    @Value("${cors.allowed-origins}")
    private List<String> allowedOrigins;

    private final JwtRequestFilter jwtRequestFilter;

    @Autowired
    public WebsecurityConfig(JwtRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }

    /**
     * Configures security filter settings for the application.
     * This method sets up authorization rules, disables CSRF protection,
     * configures CORS settings, and integrates JWT-based authentication
     * via a custom filter.
     *
     * @param http the {@code HttpSecurity} object to configure security settings
     * @return the configured {@code SecurityFilterChain} object
     * @throws Exception if an error occurs during the configuration process
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests.requestMatchers("/api/users/login", "/api/users/register", "/api/users/mail-confirmation", "/error", "/actuator/health/**", "/actuator/info").permitAll().anyRequest().authenticated())
                .csrf(AbstractHttpConfigurer::disable)
                .cors(httpSecurityCorsConfigurer -> httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource()))
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    /**
     * Configures the CORS (Cross-Origin Resource Sharing) settings for the application.
     * This method defines origin, methods, and headers allowed for incoming requests.
     *
     * @return a {@code CorsConfigurationSource} instance that provides the defined CORS settings
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        return request -> {
            CorsConfiguration corsConfiguration = new CorsConfiguration();
            corsConfiguration.setAllowedOrigins(allowedOrigins);
            corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            corsConfiguration.setAllowedHeaders(List.of("*"));
            return corsConfiguration;
        };
    }
}
