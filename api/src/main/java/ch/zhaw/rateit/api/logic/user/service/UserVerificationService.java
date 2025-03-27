package ch.zhaw.rateit.api.logic.user.service;

import ch.zhaw.rateit.api.logic.user.entity.User;
import ch.zhaw.rateit.api.logic.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserVerificationService {
    private final UserRepository userRepository;

    public UserVerificationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean verifyUser(String email, String token) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (user.getVerificationToken().equals(token)) {
                user.setEmailVerified(true);
                user.setVerificationToken(null); // Clear the token after verification
                userRepository.save(user);
                return true;
            }
        }

        return false;
    }
}
