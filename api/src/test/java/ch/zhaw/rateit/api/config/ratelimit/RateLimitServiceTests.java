package ch.zhaw.rateit.api.config.ratelimit;

import com.github.benmanes.caffeine.cache.Cache;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RateLimitServiceTests {

    private RateLimitService rateLimitService;

    @Mock
    private Cache<String, Bucket> ipCache;

    @Mock
    private RateLimitProperties rateLimitProperties;

    @Mock
    private Bucket bucket;

    @Mock
    private ConsumptionProbe probe;

    @Mock
    private RateLimitProperties.RateLimit rateLimit;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        rateLimitService = new RateLimitService(ipCache, rateLimitProperties);
    }

    @Test
    void testTryConsume_WhenAllowed_ShouldReturnRemainingTokens() {
        String ip = "127.0.0.1";
        String path = "/test";
        when(rateLimit.getPath()).thenReturn(path);
        when(rateLimitProperties.getRateLimit(path)).thenReturn(rateLimit);
        when(ipCache.get(eq(ip + ":" + path), any())).thenReturn(bucket);
        when(bucket.tryConsumeAndReturnRemaining(1)).thenReturn(probe);
        when(probe.isConsumed()).thenReturn(true);
        when(probe.getRemainingTokens()).thenReturn(5L);

        ConsumptionProbe result = rateLimitService.tryConsume(ip, path);

        assertTrue(result.isConsumed());
        assertEquals(5L, result.getRemainingTokens());
    }

    @Test
    void testTryConsume_WhenBlocked_ShouldReturnWaitTime() {
        String ip = "127.0.0.1";
        String path = "/test";
        when(rateLimit.getPath()).thenReturn(path);
        when(rateLimitProperties.getRateLimit(path)).thenReturn(rateLimit);
        when(ipCache.get(eq(ip + ":" + path), any())).thenReturn(bucket);
        when(bucket.tryConsumeAndReturnRemaining(1)).thenReturn(probe);
        when(probe.isConsumed()).thenReturn(false);
        when(probe.getNanosToWaitForRefill()).thenReturn(5000000000L);

        ConsumptionProbe result = rateLimitService.tryConsume(ip, path);

        assertFalse(result.isConsumed());
        assertEquals(5000000000L, result.getNanosToWaitForRefill());
    }
}
