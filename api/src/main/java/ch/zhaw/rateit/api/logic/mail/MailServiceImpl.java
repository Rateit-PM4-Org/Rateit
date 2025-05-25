package ch.zhaw.rateit.api.logic.mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Implementation of the MailService interface for handling email operations.
 * This service relies on Spring's JavaMailSender for email sending capabilities.
 *
 * @author Fabio Huber
 */
@Service
public class MailServiceImpl implements MailService {
    private JavaMailSender emailSender;

    @Value("${spring.mail.active}")
    private boolean active;

    @Value("${spring.mail.username}")
    private String username;

    public MailServiceImpl(@Autowired(required = false) JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    /**
     * Sends an email to the specified recipient with the provided subject and text.
     * The email will be sent only if the email service is active.
     *
     * @param recipient the email address of the recipient
     * @param subject   the subject of the email
     * @param text      the body text of the email
     */
    @Override
    public void sendEmail(String recipient, String subject, String text) {
        if (active) {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(username);
            message.setTo(recipient);
            message.setSubject(subject);
            message.setText(text);

            emailSender.send(message);
        }
    }
}
