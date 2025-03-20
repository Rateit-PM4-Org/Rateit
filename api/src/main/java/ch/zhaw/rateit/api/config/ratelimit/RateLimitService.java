package ch.zhaw.rateit.api.config.ratelimit;

import com.github.benmanes.caffeine.cache.Cache;
import io.github.bucket4j.*;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.time.Duration;

/**
 * Service for rate limiting.
 *
 */
@Service
@ConditionalOnProperty(value = "rate.limiting.enabled", havingValue = "true")
public class RateLimitService {

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
     * @param ip IP address of the request
     * @param path Request path
     * @return
     */
    public ConsumptionProbe tryConsume(String ip, String path) {

        RateLimitProperties.RateLimit rateLimit = rateLimitProperties.getRateLimit(path);

        Bucket bucket = resolveBucket(ip, rateLimit);
        return bucket.tryConsumeAndReturnRemaining(1);

    }

    /**
     * Resolves the bucket for the given IP and path.
     * If the bucket does not exist, a new bucket is created.
     *
     * @param ip
     * @param rateLimit
     * @return
     */
    private Bucket resolveBucket(String ip, RateLimitProperties.RateLimit rateLimit) {
        return ipCache.get(ip + ":" + rateLimit.getPath(), k -> createNewBucket(rateLimit));
    }

    /**
     * Creates a new bucket for the given rate limit.
     *
     * @param rateLimit
     * @return
     */
    private Bucket createNewBucket(RateLimitProperties.RateLimit rateLimit) {
        return Bucket.builder()
                .addLimit(BandwidthBuilder.builder().capacity(rateLimit.getLimit()).refillGreedy(rateLimit.getLimit(), Duration.ofSeconds(rateLimit.getDuration())).build())
                .build();
    }


}
