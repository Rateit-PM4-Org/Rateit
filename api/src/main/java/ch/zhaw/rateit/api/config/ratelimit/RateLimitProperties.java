package ch.zhaw.rateit.api.config.ratelimit;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Pattern;

/**
 * Configuration properties for rate limiting.
 *
 * @author Achille Hünenberger
 */
@Component
@ConditionalOnProperty(value = "rate.limiting.enabled", havingValue = "true")
@ConfigurationProperties(prefix = "rate.limiting")
public class RateLimitProperties {

    private static final Logger logger = LoggerFactory.getLogger(RateLimitProperties.class);

    /**
     * Whether rate limiting is enabled.
     */
    private boolean enabled;

    /**
     * List of rate limits.
     */
    private List<RateLimit> rateLimits;

    /**
     * Logs the rate-limiting configuration.
     */
    @PostConstruct
    public void init() {
        logger.info("Rate limiting enabled: {}", enabled);
        rateLimits.forEach(rateLimit -> logger.info("Rate limit path: {} - Limit: {} - Duration: {} seconds", rateLimit.getPath(), rateLimit.getLimit(), rateLimit.getDuration()));
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public List<RateLimit> getRateLimits() {
        return rateLimits;
    }

    public void setRateLimits(List<RateLimit> rateLimits) {
        this.rateLimits = rateLimits;
    }

    /**
     * Retrieves the {@code RateLimit} configuration for the specified path.
     * This method searches through the list of configured rate limits and returns
     * the most specific match for the given path. If no match is found, it returns {@code null}.
     *
     * @param path the request path to find the rate limit configuration for
     * @return the corresponding {@code RateLimit} object for the given path, or {@code null} if no match is found
     */
    public RateLimit getRateLimit(String path) {
        return rateLimits.stream()
                .filter(rateLimit -> Pattern.matches(rateLimit.getPath().replace("/**", "/.*"), path))
                .reduce((first, second) -> second)
                .orElse(null);
    }

    /**
     * Rate limit configuration.
     */
    public static class RateLimit {
        /**
         * Path to limit. Format /path/**
         */
        private String path;
        /**
         * Limit of requests.
         */
        private int limit;
        /**
         * Duration of the limit in Seconds.
         */
        private int duration;

        public String getPath() {
            return path;
        }

        public void setPath(String path) {
            this.path = path;
        }

        public int getLimit() {
            return limit;
        }

        public void setLimit(int limit) {
            this.limit = limit;
        }

        public int getDuration() {
            return duration;
        }

        public void setDuration(int duration) {
            this.duration = duration;
        }
    }
}
