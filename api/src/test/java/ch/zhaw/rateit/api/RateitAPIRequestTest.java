package ch.zhaw.rateit.api;

import ch.zhaw.rateit.api.test.TestEntityRepository;
import ch.zhaw.rateit.api.util.AbstractBaseIntegrationTest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Fail.fail;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
public class RateitAPIRequestTest extends AbstractBaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TestEntityRepository testEntityRepository;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void endpointTest() throws Exception {
        mockMvc.perform(get("/test").contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Hello World")));
    }
}
