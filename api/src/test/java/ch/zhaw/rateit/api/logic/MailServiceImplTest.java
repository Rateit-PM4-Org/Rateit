package ch.zhaw.rateit.api.logic;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.junit.jupiter.api.Assertions.assertEquals;

import ch.zhaw.rateit.api.logic.mail.MailServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
public class MailServiceImplTest {

    @Mock
    private JavaMailSender emailSender;

    private MailServiceImpl mailService;

    @BeforeEach
    public void setUp() {
        mailService = new MailServiceImpl();
        // Inject the mock emailSender into the mailService instance
        ReflectionTestUtils.setField(mailService, "emailSender", emailSender);
    }

    @Test
    public void testSendEmail() {
        String recipient = "test@example.com";
        String subject = "Test Subject";
        String text = "Test Email Body";

        mailService.sendEmail(recipient, subject, text);

        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(emailSender, times(1)).send(messageCaptor.capture());
        SimpleMailMessage sentMessage = messageCaptor.getValue();

        assertEquals("rateitpm4.noreply@gmail.com", sentMessage.getFrom());
        assertEquals(recipient, sentMessage.getTo()[0]);
        assertEquals(subject, sentMessage.getSubject());
        assertEquals(text, sentMessage.getText());
    }
}