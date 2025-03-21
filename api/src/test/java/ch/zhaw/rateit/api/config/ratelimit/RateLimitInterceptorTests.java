package ch.zhaw.rateit.api.config.ratelimit;

import com.github.benmanes.caffeine.cache.Cache;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

class RateLimitInterceptorTests {

    private RateLimitInterceptor rateLimitInterceptor;


    private RateLimitProperties rateLimitProperties;

    @Mock
    private RateLimitService rateLimitService;

    @Mock
    private Cache<String, Bucket> ipCache;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private Object handler;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        rateLimitProperties = new RateLimitProperties();
        rateLimitInterceptor = new RateLimitInterceptor(rateLimitService, rateLimitProperties);
    }

    @Test
    void testPreHandle_WhenRateLimitDisabled_ShouldAllowRequest() throws Exception {
        rateLimitProperties.setEnabled(false);

        assertTrue(rateLimitInterceptor.preHandle(request, response, handler));
    }

    @Test
    void testPreHandle_WhenRequestToErrorEndpoint_ShouldAllowRequest() throws Exception {
        rateLimitProperties.setEnabled(true);
        when(request.getRequestURI()).thenReturn("/error");

        assertTrue(rateLimitInterceptor.preHandle(request, response, handler));
    }

    @Test
    void testPreHandle_WhenRequestIsAllowed_ShouldAllowRequest() throws Exception {
        rateLimitProperties.setEnabled(true);
        when(request.getRequestURI()).thenReturn("/test");
        when(request.getHeader("X-FORWARDED-FOR")).thenReturn(null);
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");
        when(rateLimitService.tryConsume("127.0.0.1", "/test")).thenReturn(ConsumptionProbe.consumed(5, 2*1_000_000_000));

        boolean result = rateLimitInterceptor.preHandle(request, response, new Object());
        assertTrue(result);
        verify(response).addHeader("X-Rate-Limit-Remaining", "5");
    }

    @Test
    void testPreHandle_WhenRequestIsBlocked_ShouldReturnTooManyRequests() throws Exception {
        rateLimitProperties.setEnabled(true);
        when(request.getRequestURI()).thenReturn("/test");
        when(request.getHeader("X-FORWARDED-FOR")).thenReturn(null);
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");
        when(rateLimitService.tryConsume("127.0.0.1", "/test")).thenReturn(ConsumptionProbe.rejected(0, 5L *1_000_000_000, 0));

        boolean result = rateLimitInterceptor.preHandle(request, response, new Object());
        assertFalse(result);
        verify(response).addHeader("X-Rate-Limit-Retry-After-Seconds", "5");
        verify(response).sendError(HttpStatus.TOO_MANY_REQUESTS.value(), "You have exhausted your API Request Quota");
    }
}
