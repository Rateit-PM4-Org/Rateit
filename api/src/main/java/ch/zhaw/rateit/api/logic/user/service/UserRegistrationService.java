package ch.zhaw.rateit.api.logic.user.service;

import ch.zhaw.rateit.api.exceptions.types.DuplicateEmailUserException;
import ch.zhaw.rateit.api.logic.mail.MailService;
import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.logic.user.entity.UserRegistrationRequest;
import ch.zhaw.rateit.api.logic.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Class to handle user creation.
 *
 * @author Nicolas Zillig
 */
@Service
public class UserRegistrationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncrypter;
    private final MailService mailService;

    @Value("${app.base-url}")  // Add this to your application.properties
    private String baseUrl;

    public UserRegistrationService(UserRepository userRepository, PasswordEncoder passwordEncrypter, MailService mailService) {
        this.userRepository = userRepository;
        this.passwordEncrypter = passwordEncrypter;
        this.mailService = mailService;
    }

    public User register(UserRegistrationRequest userRegistrationRequest) {
        checkEmailUnique(userRegistrationRequest.email());

        User newUser = new User(userRegistrationRequest.email(), userRegistrationRequest.displayName(), hashCleanPassword(userRegistrationRequest.password()));
        userRepository.save(newUser);

        sendVerificationEmail(newUser);

        return newUser;
    }

    private void sendVerificationEmail(User user) {
        String verificationUrl = String.format(
                "%s/user/confirm?token=%s&email=%s",
                baseUrl,
                user.getVerificationToken(),
                user.getEmail()
        );

        String emailSubject = "Please verify your email address";
        String emailText = String.format(
                "Please verify your email address by clicking on the following link:\n%s\n\n" +
                "If you did not create an account on Rateit, you can safely ignore this email.",
                verificationUrl
        );

        mailService.sendEmail(user.getEmail(), emailSubject, emailText);
    }

    private void checkEmailUnique(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            throw new DuplicateEmailUserException("User with email " + email + " already exists");
        });
    }

    private String hashCleanPassword(String password) {
        return passwordEncrypter.encode(password);
    }
}
