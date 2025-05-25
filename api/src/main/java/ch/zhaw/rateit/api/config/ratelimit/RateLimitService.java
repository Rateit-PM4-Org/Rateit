package ch.zhaw.rateit.api.config.ratelimit;

import com.github.benmanes.caffeine.cache.Cache;
import io.github.bucket4j.BandwidthBuilder;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.time.Duration;

/**
 * Service for rate limiting.
 *
 * @author Achille Hünenberger
 */
@Service
@ConditionalOnProperty(value = "rate.limiting.enabled", havingValue = "true")
public class RateLimitService {
    private static final Logger logger = LoggerFactory.getLogger(RateLimitService.class);

    // TODO should be distributed via db
    private final Cache<String, Bucket> ipCache;

    private final RateLimitProperties rateLimitProperties;

    public RateLimitService(Cache<String, Bucket> ipCache, RateLimitProperties rateLimitProperties) {
        this.ipCache = ipCache;
        this.rateLimitProperties = rateLimitProperties;
    }

    /**
     * Tries to consume a token from the rate limit bucket.
     * If the bucket is full, the request is denied.
     * If the bucket is not full, the request is allowed and the remaining tokens are returned.
     *
     * @param ip   the IP address of the client attempting to consume a request
     * @param path the request path associated with the rate limit rule
     * @return a {@code ConsumptionProbe} object containing information about the consumption result,
     * remaining tokens, and wait time for the next token refill
     */
    public ConsumptionProbe tryConsume(String ip, String path) {

        RateLimitProperties.RateLimit rateLimit = rateLimitProperties.getRateLimit(path);

        Bucket bucket = resolveBucket(ip, rateLimit);
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        logger.trace("Consumed RateLimit for [{}:{}]", ip, path);
        logger.trace("Consumed: {} - Remaining: {} - Wait Time: {}", probe.isConsumed(), probe.getRemainingTokens(), probe.getNanosToWaitForRefill());
        return probe;

    }

    /**
     * Resolves the bucket for the given IP and path.
     * If the bucket does not exist, a new bucket is created.
     *
     * @param ip        the IP address for which the rate-limiting bucket is to be resolved
     * @param rateLimit the rate limit configuration containing the path, limit, and duration
     * @return the resolved or newly created {@code Bucket} associated with the given IP and rate limit
     */
    private Bucket resolveBucket(String ip, RateLimitProperties.RateLimit rateLimit) {
        return ipCache.get(ip + ":" + rateLimit.getPath(), k -> createNewBucket(rateLimit));
    }

    /**
     * Creates a new bucket for the given rate limit.
     *
     * @param rateLimit the configuration containing the limit and duration for the bucket
     * @return a new instance of {@code Bucket} configured with the specified rate limit
     */
    private Bucket createNewBucket(RateLimitProperties.RateLimit rateLimit) {
        return Bucket.builder()
                .addLimit(BandwidthBuilder.builder().capacity(rateLimit.getLimit()).refillGreedy(rateLimit.getLimit(), Duration.ofSeconds(rateLimit.getDuration())).build())
                .build();
    }


}
