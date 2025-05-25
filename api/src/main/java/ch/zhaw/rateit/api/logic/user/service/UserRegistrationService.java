package ch.zhaw.rateit.api.logic.user.service;

import ch.zhaw.rateit.api.exceptions.types.ValidationExceptionWithField;
import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.logic.user.entity.UserRegistrationRequest;
import ch.zhaw.rateit.api.logic.user.repository.UserRepository;
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

    /**
     * Registers a new user in the system. The method validates the uniqueness of the user's email,
     * hashes the provided password, sends a verification email to the user, and saves the user
     * in the repository.
     *
     * @param userRegistrationRequest the request object containing the email, display name, and password
     *                                for the user to be registered.
     * @return the newly registered User object with the hashed password and verification details.
     * @throws ValidationExceptionWithField if the provided email already exists in the system.
     */
    public User register(UserRegistrationRequest userRegistrationRequest) {
        checkEmailUnique(userRegistrationRequest.email());

        User newUser = new User(userRegistrationRequest.email(), userRegistrationRequest.displayName(), hashCleanPassword(userRegistrationRequest.password()));
        newUser = userVerificationService.sendVerificationEmail(newUser);
        userRepository.save(newUser);

        return newUser;
    }

    private void checkEmailUnique(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            throw new ValidationExceptionWithField(new ValidationExceptionWithField.ValidationError("email", "User with email " + email + " already exists"));
        });
    }

    private String hashCleanPassword(String password) {
        return passwordEncrypter.encode(password);
    }
}
