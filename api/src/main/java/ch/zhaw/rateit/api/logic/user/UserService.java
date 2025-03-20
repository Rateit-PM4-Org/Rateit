package ch.zhaw.rateit.api.logic.user;

import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.logic.user.entity.UserRegistrationRequest;
import ch.zhaw.rateit.api.logic.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(UserRegistrationRequest userRegistrationRequest) {
        checkEmailUnique(userRegistrationRequest.getEmail());

        User newUser = new User(userRegistrationRequest.getEmail(), userRegistrationRequest.getDisplayName(), hashCleanPassword(userRegistrationRequest.getCleanPassword()));
        userRepository.save(newUser);
        return newUser;
    }

    private void checkEmailUnique(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            throw new RuntimeException("User with email " + email + " already exists");
        });
    }

    private String hashCleanPassword(String password) {
        //ToDo implement
        return password;
    }
}
