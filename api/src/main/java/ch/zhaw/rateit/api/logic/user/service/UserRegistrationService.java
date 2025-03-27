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
    private final UserVerificationService userVerificationService;

    public UserRegistrationService(UserRepository userRepository, PasswordEncoder passwordEncrypter, UserVerificationService userVerificationService) {
        this.userRepository = userRepository;
        this.passwordEncrypter = passwordEncrypter;
        this.userVerificationService = userVerificationService;
    }

    public User register(UserRegistrationRequest userRegistrationRequest) {
        checkEmailUnique(userRegistrationRequest.email());

        User newUser = new User(userRegistrationRequest.email(), userRegistrationRequest.displayName(), hashCleanPassword(userRegistrationRequest.password()));
        newUser = userVerificationService.sendVerificationEmail(newUser);
        userRepository.save(newUser);

        return newUser;
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
