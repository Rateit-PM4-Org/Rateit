package ch.zhaw.rateit.api.logic.mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class MailServiceImpl implements MailService {
    private JavaMailSender emailSender; // Ignore error, it works

    @Value("${spring.mail.active}")
    private boolean active;

    @Value("${spring.mail.username}")
    private String username;


    public MailServiceImpl(@Autowired(required = false) JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    @Override
    public void sendEmail(String recipient, String subject, String text) {
        if(active) {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(username);
            message.setTo(recipient);
            message.setSubject(subject);
            message.setText(text);

            emailSender.send(message);
        }
    }
}
