package ch.zhaw.rateit.api.logic.attachment;

import ch.zhaw.rateit.api.config.WebsecurityConfig;
import ch.zhaw.rateit.api.logic.attachment.entity.Attachment;
import ch.zhaw.rateit.api.util.AbstractBaseIntegrationTest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@Import(WebsecurityConfig.class)
class RateitAPIAttachmentCreateImageRequestTests extends AbstractBaseIntegrationTest {

    private final String imageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAEElEQVR4nGKaOO8mIAAA//8D1AIL3/5trAAAAABJRU5ErkJggg=="; //Valid Base 64 image png

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        // Setup code if needed
    }

    @Test
    void testEndpointCreateImageRequestPositive() throws Exception {
        // Create a valid request body
        MockMultipartFile file = new MockMultipartFile("file", "test.png", "image/png", Base64.getDecoder().decode(imageBase64));

        // Perform the request and assert the response
        String result = mockMvc.perform(multipart("/api/attachments/images").file(file).with(user("test")))
                .andExpect(status().is2xxSuccessful()).andReturn().getResponse().getContentAsString();

        Attachment attachment = objectMapper.readValue(result, Attachment.class);
        assertNotNull(attachment);
        assertNotNull(attachment.getId());
        assertNotNull(attachment.getUrl());
        assertNotNull(attachment.getCreatedAt());
        assertNotNull(attachment.getUpdatedAt());
    }

    @Test
    void testEndpointCreateImageRequestNegative_NoFile() throws Exception {
        mockMvc.perform(multipart("/api/attachments/images").with(user("test"))).andExpect(status().isBadRequest());
    }

    @Test
    void testEndpointCreateImageRequestNegative_InvalidFile() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "Invalid content".getBytes());

        mockMvc.perform(multipart("/api/attachments/images").file(file).with(user("test"))).andExpect(status().isBadRequest());
    }

    @Test
    void testEndpointCreateImageRequestNegative_ImageToBig() throws Exception {
        // Create a file that exceeds the maximum size limit
        byte[] largeImage = new byte[10 * 1024 * 1024]; // 10 MB
        MockMultipartFile file = new MockMultipartFile("file", "large.png", "image/png", largeImage);

        mockMvc.perform(multipart("/api/attachments/images").file(file).with(user("test")))
                .andExpect(status().isBadRequest());
    }

}
