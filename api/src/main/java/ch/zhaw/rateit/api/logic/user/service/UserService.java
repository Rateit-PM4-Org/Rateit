package ch.zhaw.rateit.api.logic.user.service;

import ch.zhaw.rateit.api.logic.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Service for handling user-related operations and implementing Spring Security's {@code UserDetailsService}.
 *
 * @author Achille Hünenberger
 */
@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * This method queries the data source to retrieve a user matching the provided
     * email. If no user is found, a {@code UsernameNotFoundException} is thrown.
     *
     * @param username the email of the user to be retrieved
     * @return the {@code UserDetails} for the user corresponding to the provided email
     * @throws UsernameNotFoundException if no user is found for the provided email
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
