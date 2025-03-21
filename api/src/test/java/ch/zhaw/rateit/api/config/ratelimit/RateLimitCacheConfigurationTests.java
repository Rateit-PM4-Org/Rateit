package ch.zhaw.rateit.api.config.ratelimit;

import com.github.benmanes.caffeine.cache.Cache;
import io.github.bucket4j.Bucket;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

class RateLimitCacheConfigurationTests {

    @InjectMocks
    private RateLimitCacheConfiguration rateLimitCacheConfiguration;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(rateLimitCacheConfiguration, "maximumSize", 100L);
        ReflectionTestUtils.setField(rateLimitCacheConfiguration, "expireAfterWrite", 10L);
    }

    @Test
    void testRateLimitCache_ShouldCreateCache() {
        Cache<String, Bucket> cache = rateLimitCacheConfiguration.rateLimitCache();
        assertNotNull(cache);
        assertEquals(100L, cache.policy().eviction().get().getMaximum());
        assertEquals(10L, cache.policy().expireAfterWrite().get().getExpiresAfter(TimeUnit.MINUTES));
    }

    @Test
    void testRateLimitCache_invalidExpiresAfterNegative() {
        ReflectionTestUtils.setField(rateLimitCacheConfiguration, "expireAfterWrite", -1L);
        assertThrows(IllegalArgumentException.class, () -> rateLimitCacheConfiguration.rateLimitCache());
    }

    @Test
    void testRateLimitCache_invalidMaximumSizeNegative() {
        ReflectionTestUtils.setField(rateLimitCacheConfiguration, "maximumSize", -1L);
        assertThrows(IllegalArgumentException.class, () -> rateLimitCacheConfiguration.rateLimitCache());
    }
}
