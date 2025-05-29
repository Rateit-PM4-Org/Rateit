package ch.zhaw.rateit.api.config;

import ch.zhaw.rateit.api.config.ratelimit.RateLimitInterceptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration class for the WebMvc.
 *
 * @author Achille Hünenberger
 */
@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer {
    private static final Logger logger = LoggerFactory.getLogger(WebMvcConfiguration.class);

    private RateLimitInterceptor rateLimitInterceptor;

    public WebMvcConfiguration(@Autowired(required = false) RateLimitInterceptor rateLimitInterceptor) {
        this.rateLimitInterceptor = rateLimitInterceptor;
    }

    /**
     * Registers interceptors with the application.
     * This method adds the rate-limit interceptor to the provided {@code InterceptorRegistry},
     * applying it to all request paths if the interceptor is enabled.
     *
     * @param registry the {@code InterceptorRegistry} where interceptors are registered
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Add the rate limit interceptor if it is not null (enabled).
        if (rateLimitInterceptor != null) {
            logger.debug("Added rate limit interceptor");
            registry.addInterceptor(rateLimitInterceptor).addPathPatterns("/**");
        }
    }
}
