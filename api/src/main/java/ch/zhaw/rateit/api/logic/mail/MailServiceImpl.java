package ch.zhaw.rateit.api.logic.mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class MailServiceImpl implements MailService {

    @Autowired
    private JavaMailSender emailSender; // Ignore error, it works

    @Override
    public void sendEmail(String recipient, String subject, String text) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("rateitpm4.noreply@gmail.com");
        message.setTo(recipient);
        message.setSubject(subject);
        message.setText(text);

        emailSender.send(message);
    }
}
