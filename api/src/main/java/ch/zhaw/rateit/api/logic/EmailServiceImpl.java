package ch.zhaw.rateit.api.logic;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Override
    public void sendEmail(String recipient, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("rateit-noreply@gmail.com");
        message.setTo(recipient);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }
}
