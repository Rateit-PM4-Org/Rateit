package ch.zhaw.rateit.api.config.ratelimit;

import ch.zhaw.rateit.api.util.AbstractBaseIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@TestPropertySource(locations = {"classpath:config/ratelimit/test-ratelimit.properties"})
class RateLimitIntegrationTests extends AbstractBaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void endpointBlocksRequestsAfterLimit() throws Exception {
        int limit = 5; // Adjust based on your rate limit configuration

        for (int i = 0; i < limit; i++) {
            mockMvc.perform(get("/").with(user("test")))
                    .andExpect(status().isNotFound());
        }

        // The next request should be blocked
        mockMvc.perform(get("/").with(user("test")))
                .andExpect(status().isTooManyRequests());
    }

    // TODO add multiendpoint test
}
