package ch.zhaw.rateit.api.config.ratelimit;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.bucket4j.Bucket;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * Configuration for the rate limit cache.
 * The cache is used to store the rate limit buckets.
 *
 * @see RateLimitService
 * @author Achille Hünenberger
 */
@Configuration
@ConditionalOnProperty(value = "rate.limiting.enabled", havingValue = "true")
public class RateLimitCacheConfiguration {

    /**
     * Maximum size of the cache.
     */
    @Value("${rate.limiting.cache.maximum-size}")
    private long maximumSize;

    /**
     * Expire after write time of the cache in Minutes.
     */
    @Value("${rate.limiting.cache.expire-after-write}")
    private long expireAfterWrite;

    private static final Logger logger = LoggerFactory.getLogger(RateLimitCacheConfiguration.class);

    @PostConstruct
    public void init() {
        logger.info("Rate limit cache configuration: Maximum size: {} - Expire after write: {} minutes", maximumSize, expireAfterWrite);
    }

    /**
     * Creates the rate limit cache.
     *
     * @return the rate limit cache
     */
    @Bean
    public Cache<String, Bucket> rateLimitCache() {
        return Caffeine.newBuilder()
                .maximumSize(maximumSize)
                .expireAfterWrite(expireAfterWrite, TimeUnit.MINUTES)
                .build();
    }
}
