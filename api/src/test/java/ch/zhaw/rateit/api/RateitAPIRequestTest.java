package ch.zhaw.rateit.api;

import ch.zhaw.rateit.api.config.WebsecurityConfig;
import ch.zhaw.rateit.api.util.AbstractBaseIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@Import(WebsecurityConfig.class)
public class RateitAPIRequestTest extends AbstractBaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void endpointTest() throws Exception {
        mockMvc.perform(get("/test").contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Hello World")));
    }
}
