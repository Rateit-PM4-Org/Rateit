package ch.zhaw.rateit.api.logic.user.service;

import ch.zhaw.rateit.api.logic.mail.MailService;
import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.logic.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserVerificationService {
    private final UserRepository userRepository;
    private final MailService mailService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${user.registration.email.subject}")
    private String emailSubject;

    @Value("${user.registration.email.body}")
    private String emailBody;

    public UserVerificationService(UserRepository userRepository, MailService mailService) {
        this.userRepository = userRepository;
        this.mailService = mailService;
    }

    public User sendVerificationEmail(User user) {
        user.setEmailVerified(false);
        user.setEmailVerificationToken(UUID.randomUUID().toString());

        String verificationUrl = String.format(
                "%s/user/mail-confirmation?token=%s",
                frontendUrl,
                user.getEmailVerificationToken()
        );

        String emailText = String.format(
                emailBody,
                verificationUrl
        );

        mailService.sendEmail(user.getEmail(), emailSubject, emailText);

        return user;
    }

    public boolean verifyUser(String token) {
        Optional<User> userOptional = userRepository.findByEmailVerificationToken(token);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            user.setEmailVerified(true);
            user.setEmailVerificationToken(null); // Clear the token after verification
            userRepository.save(user);
            return true;
        }

        return false;
    }
}
