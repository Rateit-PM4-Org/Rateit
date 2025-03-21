package ch.zhaw.rateit.api.config.ratelimit;

import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Interceptor for rate limiting.
 * The interceptor checks if the request is allowed to be processed.
 *
 * @author Achille Hünenberger
 */
@Configuration
@ConditionalOnProperty(value = "rate.limiting.enabled", havingValue = "true")
public class RateLimitInterceptor implements HandlerInterceptor {
    private final Logger logger = LoggerFactory.getLogger(RateLimitInterceptor.class);
    private RateLimitService rateLimitService;

    private RateLimitProperties rateLimitProperties;

    public RateLimitInterceptor(RateLimitService rateLimitService, RateLimitProperties rateLimitProperties) {
        this.rateLimitService = rateLimitService;
        this.rateLimitProperties = rateLimitProperties;
    }

    /**
     * Pre-handle method to check if the request is allowed to be processed.
     * If the request is allowed, the remaining tokens are added to the response.
     * If the request is not allowed, the response is set to a 429 status code.
     *
     * The method checks if the rate limiting is enabled and if the request is not an error request.
     *
     * @param request current HTTP request
     * @param response current HTTP response
     * @param handler chosen handler to execute, for type and/or instance evaluation
     * @return
     * @throws Exception
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if(!rateLimitProperties.isEnabled()){
            logger.trace("RateLimitInterceptor is disabled");
            return true;
        }
        if(request.getRequestURI().equals("/error")) {
            logger.trace("Request to error endpoint. Skipping rate limiting.");
            return true;
        }

        String ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null) {
            ipAddress = request.getRemoteAddr();
        }

        logger.trace("IP Address: {}", ipAddress);

        ConsumptionProbe probe = rateLimitService.tryConsume(ipAddress, request.getRequestURI());
        if (probe.isConsumed()) {
            logger.trace("Request allowed. Remaining tokens: {}", probe.getRemainingTokens());
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            return true;
        } else {
            logger.trace("Request denied. Wait for refill: {} seconds", probe.getNanosToWaitForRefill() / 1_000_000_000);
            long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
            response.addHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(waitForRefill));
            response.sendError(HttpStatus.TOO_MANY_REQUESTS.value(),
                    "You have exhausted your API Request Quota");
            return false;
        }
    }
}
