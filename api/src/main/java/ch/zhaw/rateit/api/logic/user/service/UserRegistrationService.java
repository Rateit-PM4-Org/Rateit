package ch.zhaw.rateit.api.logic.user.service;

import ch.zhaw.rateit.api.exceptions.types.DuplicateEmailUserException;
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

    public UserRegistrationService(UserRepository userRepository, PasswordEncoder passwordEncrypter) {
        this.userRepository = userRepository;
        this.passwordEncrypter = passwordEncrypter;
    }

    public User register(UserRegistrationRequest userRegistrationRequest) {
        checkEmailUnique(userRegistrationRequest.getEmail());

        User newUser = new User(userRegistrationRequest.getEmail(), userRegistrationRequest.getDisplayName(), hashCleanPassword(userRegistrationRequest.getCleanPassword()));
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
