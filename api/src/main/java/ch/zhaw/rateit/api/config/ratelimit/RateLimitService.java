package ch.zhaw.rateit.api.config.ratelimit;

import io.github.bucket4j.*;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    // TODO should be distributed via db
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    public ConsumptionProbe tryConsume(String ip) {
        Bucket bucket = resolveBucket(ip);
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        return probe;
    }

    private Bucket resolveBucket(String ip) {
        return cache.computeIfAbsent(ip, key -> createNewBucket());
    }

    private Bucket createNewBucket() {
        // TODO externalize configuration
        return Bucket.builder()
                .addLimit(BandwidthBuilder.builder().capacity(1).refillGreedy(1, Duration.ofSeconds(10)).build())
                .build();
    }


}
