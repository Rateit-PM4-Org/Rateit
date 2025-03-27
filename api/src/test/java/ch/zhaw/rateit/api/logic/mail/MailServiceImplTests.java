package ch.zhaw.rateit.api.logic.mail;

import ch.zhaw.rateit.api.util.AbstractBaseIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MailServiceImplTest {

    @Mock
    private JavaMailSender emailSender;

    @InjectMocks
    private MailServiceImpl mailService;

    @BeforeEach
    void setUp() {
        mailService = new MailServiceImpl(emailSender);
        ReflectionTestUtils.setField(mailService, "active", true);
        ReflectionTestUtils.setField(mailService, "username", "test@test.ch");
    }

    @Test
    void testSendEmailWhenActive() {
        String recipient = "test@example.com";
        String subject = "Test Subject";
        String text = "Test Message";

        mailService.sendEmail(recipient, subject, text);

        verify(emailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testSendEmailWhenInactive() {
        ReflectionTestUtils.setField(mailService, "active", false);
        mailService.sendEmail("test@example.com", "Subject", "Message");

        verify(emailSender, never()).send(any(SimpleMailMessage.class));
    }
}

