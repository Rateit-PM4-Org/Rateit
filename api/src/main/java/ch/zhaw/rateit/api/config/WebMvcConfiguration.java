package ch.zhaw.rateit.api.config;

import ch.zhaw.rateit.api.config.ratelimit.RateLimitInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer {


    private RateLimitInterceptor rateLimitInterceptor;

    public WebMvcConfiguration(RateLimitInterceptor rateLimitInterceptor) {
        this.rateLimitInterceptor = rateLimitInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // TODO add PathParameter
        registry.addInterceptor(rateLimitInterceptor).addPathPatterns("/**");
    }
}
