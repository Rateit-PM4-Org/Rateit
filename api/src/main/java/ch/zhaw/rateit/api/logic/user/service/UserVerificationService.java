package ch.zhaw.rateit.api.logic.user.service;

import ch.zhaw.rateit.api.logic.mail.MailService;
import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.logic.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

/**
 * Service that handles user verification processes.
 *
 * @author Achille Hünenberger
 */
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

    @Value("${user.registration.email.link}")
    private String emailLink;

    public UserVerificationService(UserRepository userRepository, MailService mailService) {
        this.userRepository = userRepository;
        this.mailService = mailService;
    }

    /**
     * Sends a verification email to the specified user and updates the user object with
     * a generated email verification token. The email contains a link that the user
     * can click to verify their email address.
     *
     * @param user the {@code User} object for whom the verification email is to be sent.
     *             The user's email verification status will be set to false, and a new
     *             email verification token will be generated and assigned.
     * @return the updated {@code User} object with the generated email verification token
     * and email verification status set to false.
     */
    public User sendVerificationEmail(User user) {
        user.setEmailVerified(false);
        user.setEmailVerificationToken(UUID.randomUUID().toString());

        String verificationUrl = String.format(
                emailLink,
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

    /**
     * Verifies a user by checking the provided email verification token.
     * If a user is found with the matching token, the user's email verification
     * status is updated to true, the token is cleared, and the user is saved back
     * to the repository.
     *
     * @param token the email verification token to be verified
     * @return {@code true} if the token corresponds to a valid user and verification succeeds;
     * {@code false} otherwise
     */
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
