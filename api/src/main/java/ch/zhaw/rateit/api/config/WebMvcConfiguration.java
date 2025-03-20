package ch.zhaw.rateit.api.config;

import ch.zhaw.rateit.api.config.ratelimit.RateLimitInterceptor;
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
    private RateLimitInterceptor rateLimitInterceptor;


    public WebMvcConfiguration(@Autowired(required = false) RateLimitInterceptor rateLimitInterceptor) {
        this.rateLimitInterceptor = rateLimitInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Add the rate limit interceptor if it is not null (enabled).
        if (rateLimitInterceptor != null) {
            registry.addInterceptor(rateLimitInterceptor).addPathPatterns("/**");
        }
    }
}
